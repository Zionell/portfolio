import type { H3Event } from "h3";

// Повторный заход в пределах окна (от последнего захода) не считается.
// Окно — httpOnly-кука без данных о посетителе: пока она жива, заход
// повторный, и каждый заход продлевает её. В БД пишется лишь счётчик за день
const VISIT_WINDOW_SECONDS = 10 * 60;
const SITE_COOKIE = "visit";
const POST_COOKIE = "post_view";

const BOT_PATTERN =
	/bot|crawl|spider|slurp|scrap|preview|facebookexternalhit|headless|lighthouse|curl|wget|python|axios|node-fetch|go-http|java\//i;

/** клиент без user agent тоже считается ботом */
const isBot = (event: H3Event): boolean => {
	const userAgent = getRequestHeader(event, "user-agent") || "";

	return !userAgent || BOT_PATTERN.test(userAgent);
};

/**
 * true — заход новый и его нужно посчитать. В любом случае продлевает
 * куку, так что непрерывное чтение сайта остаётся одним заходом
 */
const isNewEntry = (event: H3Event, name: string, path: string): boolean => {
	const isRepeat = Boolean(getCookie(event, name));

	setCookie(event, name, "1", {
		path,
		maxAge: VISIT_WINDOW_SECONDS,
		httpOnly: true,
		sameSite: "lax",
		// в dev учёт выключен, сюда доходит только прод
		secure: true,
	});

	return !isRepeat;
};

// дни считаем по Москве, как и крон автопостов; en-CA даёт YYYY-MM-DD
const today = () =>
	new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Moscow" });

// В dev учёт выключен: локальные заходы не должны попадать в статистику
export const trackVisit = async (event: H3Event) => {
	if (import.meta.dev) return;

	if (isBot(event)) {
		await prisma.$executeRaw`
			INSERT INTO "SiteVisitDay" ("date", "bots") VALUES (${today()}::date, 1)
			ON CONFLICT ("date") DO UPDATE SET "bots" = "SiteVisitDay"."bots" + 1
		`;

		return;
	}

	// кука ставится синхронно, до первого await: middleware не ждёт
	// записи в БД, и ответ может уйти раньше
	if (!isNewEntry(event, SITE_COOKIE, "/")) return;

	await prisma.$executeRaw`
		INSERT INTO "SiteVisitDay" ("date", "count") VALUES (${today()}::date, 1)
		ON CONFLICT ("date") DO UPDATE SET "count" = "SiteVisitDay"."count" + 1
	`;
};

/**
 * Считает заход в статью и увеличивает Posts.views.
 * Возвращает false, если опубликованной статьи с таким slug нет.
 */
export const trackPostView = async (
	event: H3Event,
	slug: string,
): Promise<boolean> => {
	const post = await prisma.posts.findFirst({
		where: { slug, isPublished: true },
		select: { id: true },
	});

	if (!post) return false;

	// у каждой статьи своя кука: Path ограничивает её адресом учёта
	// просмотра этой статьи, в том же виде, в каком его прислал браузер
	const cookiePath = getRequestURL(event).pathname;

	// просмотры статей ботами не считаем вовсе: учёт идёт из JS страницы
	if (import.meta.dev || isBot(event)) return true;
	if (!isNewEntry(event, POST_COOKIE, cookiePath)) return true;

	await prisma.$transaction([
		prisma.$executeRaw`
			INSERT INTO "PostViewDay" ("postId", "date", "count")
			VALUES (${post.id}, ${today()}::date, 1)
			ON CONFLICT ("postId", "date")
			DO UPDATE SET "count" = "PostViewDay"."count" + 1
		`,
		// сырым запросом: prisma.update тронул бы updatedAt, а просмотр —
		// не правка поста
		prisma.$executeRaw`
			UPDATE "Posts" SET "views" = "views" + 1 WHERE "id" = ${post.id}
		`,
	]);

	return true;
};

export type PostGenerationSource = "cron" | "manual";

export const logPostGenerationError = async (
	source: PostGenerationSource,
	message: string,
) => {
	try {
		await prisma.postGenerationError.create({ data: { source, message } });
	} catch (error) {
		// журнал не должен ронять сам сценарий генерации
		console.error("[analytics] не удалось записать ошибку генерации", error);
	}
};

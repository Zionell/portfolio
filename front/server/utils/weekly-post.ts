import type { Posts, Prisma } from "~~/generated/prisma/client";

const slugify = (value: string): string =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 60);

// Заголовок может быть на русском — тогда от slugify ничего не остаётся,
// поэтому всегда добавляем дату и при совпадении дописываем счётчик
const resolveUniqueSlug = async (
	tx: Prisma.TransactionClient,
	title: string,
): Promise<string> => {
	const base = [slugify(title) || "post", todayDateString()].join("-");

	for (let i = 0; ; i++) {
		const slug = i ? `${base}-${i + 1}` : base;
		const exists = await tx.posts.findUnique({ where: { slug } });

		if (!exists) return slug;
	}
};

// Заготовки разбираем по очереди: сначала самые старые
const takeNextSkeleton = () =>
	prisma.postSkeleton.findFirst({
		where: { isUsed: false },
		orderBy: [{ createdAt: "asc" }, { id: "asc" }],
		include: { project: { select: SKELETON_PROJECT_SELECT } },
	});

const adminPostUrl = (id: string): string => {
	const host = process.env.SITE_HOST;

	return host ? `https://${host}/admin/blog/${id}` : `/admin/blog/${id}`;
};

/**
 * Берёт самый старый свободный скелетон, генерирует по нему пост через
 * OpenAI, сохраняет черновиком и шлёт уведомление в Telegram. Если
 * скелетонов нет, только предупреждает в Telegram и возвращает null.
 * Ошибка тоже уходит в Telegram и в журнал ошибок генерации
 * и пробрасывается дальше.
 */
export async function generateWeeklyPost(
	source: PostGenerationSource,
): Promise<Posts | null> {
	let cover = "";

	try {
		const skeleton = await takeNextSkeleton();

		if (!skeleton) {
			await logPostGenerationError(source, "Закончились заготовки постов");
			await sendTelegramMessage(
				"🗂 <b>Закончились заготовки постов</b>\nДобавьте скелетоны в админке, иначе следующий пост тоже не выйдет.",
			);

			return null;
		}

		const generated = await fetchPostDraft(skeletonDraftInput(skeleton));
		cover = await savePostCover(generated.imageBase64);

		const post = await prisma.$transaction(async (tx) => {
			// ручная генерация могла занять скелетон, пока ждали OpenAI
			const taken = await tx.postSkeleton.updateMany({
				where: { id: skeleton.id, isUsed: false },
				data: { isUsed: true },
			});

			if (!taken.count) {
				throw new Error("Скелетон уже использован другим запуском");
			}

			return tx.posts.create({
				data: {
					slug: await resolveUniqueSlug(tx, generated.title),
					title: generated.title,
					excerpt: generated.excerpt,
					date: todayDateString(),
					readTime: generated.readTime,
					cover,
					lang: skeleton.lang,
					isPublished: false,
					// те же значения, что в селекте админки
					type: "Post",
					projectId: skeleton.projectId,
					content: {
						create: normalizePostContent([
							{ text: generated.content, order: 0 },
						]),
					},
				},
			});
		});

		await sendTelegramMessage(
			[
				"📝 <b>Новый черновик поста</b>",
				escapeTelegramHtml(post.title),
				adminPostUrl(post.id),
			].join("\n"),
		);

		return post;
	} catch (error) {
		// обложка уже на диске, а запись не создалась
		await deleteUploads([cover]);

		const message = error instanceof Error ? error.message : String(error);

		await logPostGenerationError(source, message);
		await sendTelegramMessage(
			`⚠️ <b>Не удалось сгенерировать пост</b>\n${escapeTelegramHtml(message)}`,
		);

		throw error;
	}
}

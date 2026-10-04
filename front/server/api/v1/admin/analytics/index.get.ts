import type {
	IAnalyticsDay,
	IAnalyticsOverview,
	IAnalyticsTopPost,
} from "#shared/types/analytics.types";

const ALLOWED_DAYS = [7, 30, 90];
const DAY_MS = 24 * 60 * 60 * 1000;

// en-CA форматирует дату как YYYY-MM-DD
const formatDay = (date: Date) =>
	date.toLocaleDateString("en-CA", { timeZone: "Europe/Moscow" });

export default defineEventHandler(async (event): Promise<IAnalyticsOverview> => {
	const requested = Number(getQuery(event).days);
	const days = ALLOWED_DAYS.includes(requested) ? requested : 30;

	// дни в счётчиках — московские даты, считаем период теми же датами
	const todayUtc = Date.parse(`${formatDay(new Date())}T00:00:00Z`);
	const dates = Array.from({ length: days }, (_, i) =>
		new Date(todayUtc - (days - 1 - i) * DAY_MS).toISOString().slice(0, 10),
	);
	const since = dates[0]!;

	// since — московская полночь первого дня периода (UTC+3 без летнего времени)
	const errorsSince = new Date(`${since}T00:00:00+03:00`);

	const [visitDays, postDays, topPosts, errors] = await Promise.all([
		prisma.$queryRaw<{ date: string; count: number; bots: number }[]>`
			SELECT to_char("date", 'YYYY-MM-DD') AS "date", "count", "bots"
			FROM "SiteVisitDay"
			WHERE "date" >= ${since}::date
		`,
		prisma.$queryRaw<{ date: string; count: number }[]>`
			SELECT to_char("date", 'YYYY-MM-DD') AS "date", sum("count")::int AS "count"
			FROM "PostViewDay"
			WHERE "date" >= ${since}::date
			GROUP BY 1
		`,
		prisma.$queryRaw<IAnalyticsTopPost[]>`
			SELECT p."id", p."title", p."slug", sum(v."count")::int AS "views"
			FROM "PostViewDay" v
			JOIN "Posts" p ON p."id" = v."postId"
			WHERE v."date" >= ${since}::date
			GROUP BY p."id"
			ORDER BY "views" DESC
			LIMIT 10
		`,
		prisma.postGenerationError.count({
			where: { createdAt: { gte: errorsSince } },
		}),
	]);

	const visitsByDay = new Map(visitDays.map((row) => [row.date, row.count]));
	const postsByDay = new Map(postDays.map((row) => [row.date, row.count]));

	// дни без заходов тоже нужны графику
	const daily: IAnalyticsDay[] = dates.map((date) => ({
		date,
		visits: visitsByDay.get(date) || 0,
		postViews: postsByDay.get(date) || 0,
	}));

	return {
		days,
		summary: {
			visits: daily.reduce((sum, day) => sum + day.visits, 0),
			bots: visitDays.reduce((sum, row) => sum + row.bots, 0),
			postViews: daily.reduce((sum, day) => sum + day.postViews, 0),
			errors,
		},
		daily,
		topPosts,
	};
});

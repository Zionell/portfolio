import type { IPaginatedData } from "#shared/types/common.types";
import type { Posts } from "~~/generated/prisma/client";

type BlogListItem = Omit<Posts, "content" | "mainPage">;

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const toPositiveInt = (value: unknown, fallback: number): number => {
	const number = Math.floor(Number(value));

	return Number.isFinite(number) && number > 0 ? number : fallback;
};

export default defineEventHandler(
	async (event): Promise<IPaginatedData<BlogListItem>> => {
		const cookies = parseCookies(event);
		const curLang = cookies["i18n_redirected"] || "en";

		const query = getQuery(event);
		const limit = Math.min(toPositiveInt(query.limit, DEFAULT_LIMIT), MAX_LIMIT);
		const page = toPositiveInt(query.page, 1);
		const offset = (page - 1) * limit;
		// ?type=a&type=b приходит массивом — Prisma на нём падает с 500
		const type = typeof query.type === "string" ? query.type : "";

		const where = {
			lang: curLang,
			isPublished: true,
			...(type ? { type } : {}),
		};

		const [blogs, count] = await prisma.$transaction([
			prisma.posts.findMany({
				take: limit,
				skip: offset,
				orderBy: PUBLIC_POSTS_ORDER,
				where,
				include: { project: { select: PUBLIC_POST_PROJECT_SELECT } },
			}),
			prisma.posts.count({ where }),
		]);

		return {
			hasNext: count > offset + limit,
			count: count,
			data: blogs,
		};
	},
);

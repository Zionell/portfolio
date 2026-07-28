import type { IBlogQuery } from "#shared/types/blog.types";
import type { IPaginatedData } from "#shared/types/common.types";
import type { Posts } from "~~/generated/prisma/client";

type BlogListItem = Omit<Posts, "content" | "mainPage">;

export default defineEventHandler(
	async (event): Promise<IPaginatedData<BlogListItem>> => {
		const cookies = parseCookies(event);
		const curLang = cookies["i18n_redirected"] || "en";

		const query: IBlogQuery = getQuery(event);
		const limit = Number(query.limit) || 10;
		const offset = (query.page - 1) * query.limit || 0;

		const where = {
			lang: curLang,
			isPublished: true,
			...(query.type
				? {
						type: query.type,
					}
				: {}),
		};

		const blogs = await prisma.posts.findMany({
			take: limit,
			skip: offset,
			orderBy: {
				updatedAt: "asc",
			},
			where,
		});
		const count = await prisma.posts.count({ where });

		return {
			hasNext: count > offset + limit,
			count: count,
			data: blogs,
		};
	},
);

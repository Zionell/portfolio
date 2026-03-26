import type { IBlogQuery } from "#shared/types/blog.types";
import type { IPaginatedData } from "#shared/types/common.types";
import type { BlogPost } from "~~/generated/prisma/client";

export default defineEventHandler(
	async (event): Promise<IPaginatedData<BlogPost>> => {
		const cookies = parseCookies(event);
		const curLang = cookies["i18n_redirected"] || "en";

		const query: IBlogQuery = getQuery(event);

		const blogs = await prisma.blogPost.findMany({
			take: query.limit || 10,
			skip: query.offset || 0,
			orderBy: {
				updatedAt: "asc",
			},
			where: {
				type: query.type || "",
				tags: {
					has: query.project || "",
				},
			},
		});
		const count = await prisma.blogPost.count();

		return {
			hasNext: count > query.offset + query.limit,
			count: count,
			data: blogs,
		};
	},
);

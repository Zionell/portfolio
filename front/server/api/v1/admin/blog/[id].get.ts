import type { IPostAdmin } from "#shared/types/blog.types";

export default defineEventHandler(async (event): Promise<IPostAdmin> => {
	const id = getRouterParam(event, "id");

	const post = await prisma.posts.findUnique({
		where: {
			id,
		},
		include: {
			content: {
				orderBy: {
					order: "asc",
				},
			},
		},
	});

	if (!post) {
		throw createError({
			statusCode: 404,
			statusMessage: "Post not found",
		});
	}

	return post;
});

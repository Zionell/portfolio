import type { Posts } from "~~/generated/prisma/client";

export default defineEventHandler(async (event): Promise<Posts> => {
	const slug = getRouterParam(event, "slug");

	const blog = await prisma.posts.findUnique({
		where: {
			slug: slug,
		},
		include: {
			content: true,
		},
	});

	if (!blog) {
		throw createError({
			statusCode: 404,
			statusMessage: "Post not found",
		});
	}

	return blog;
});

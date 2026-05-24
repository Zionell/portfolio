import type { IBlogListAdmin } from "#shared/types/blog.types";

export default defineEventHandler(async (event): Promise<IBlogListAdmin> => {
	const [skeletons, posts] = await prisma.$transaction([
		prisma.postSkeleton.findMany(),
		prisma.posts.findMany({
			orderBy: {
				updatedAt: "asc",
			},
		}),
	]);

	return {
		skeletons,
		posts,
	};
});

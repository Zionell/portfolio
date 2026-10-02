import type { IBlogListAdmin } from "#shared/types/blog.types";

export default defineEventHandler(async (event): Promise<IBlogListAdmin> => {
	const [skeletons, posts, projects] = await prisma.$transaction([
		prisma.postSkeleton.findMany({
			include: { project: { select: POST_PROJECT_SELECT } },
			orderBy: { createdAt: "desc" },
		}),
		prisma.posts.findMany({
			orderBy: { createdAt: "desc" },
		}),
		prisma.project.findMany({
			select: POST_PROJECT_SELECT,
			orderBy: { name: "asc" },
		}),
	]);

	return {
		skeletons,
		posts,
		projects,
	};
});

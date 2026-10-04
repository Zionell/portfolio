import type { IProjectCard } from "#shared/types/project.types";

export default defineEventHandler(async (): Promise<IProjectCard[]> => {
	const projects = await prisma.project.findMany({
		orderBy: { order: "asc" },
		include: {
			stack: {
				select: {
					label: true,
				},
			},
		},
	});

	return projects.map((project) => ({
		...project,
		hasDetail: project.showDetail,
	}));
});

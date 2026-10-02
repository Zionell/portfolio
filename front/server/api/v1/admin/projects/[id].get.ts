export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");

	return prisma.project.findUnique({
		where: { id },
		include: {
			stack: true,
			blocks: { orderBy: { order: "asc" } },
			images: { orderBy: { order: "asc" } },
			links: { orderBy: { order: "asc" } },
		},
	});
});

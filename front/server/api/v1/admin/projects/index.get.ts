export default defineEventHandler(async (event) => {
	return prisma.project.findMany({
		orderBy: {
			order: "asc",
		},
		include: {
			stack: true
		},
	});
});

export default defineEventHandler(async (event) => {
	return prisma.homeExperience.findMany({
		orderBy: {
			order: "asc",
		},
		include: {
			stack: true
		},
	});
});

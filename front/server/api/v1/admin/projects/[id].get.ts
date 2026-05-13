export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");

	return prisma.project.findUnique({
		where: {id},
		include: {
			stack: true
		},
	});
});

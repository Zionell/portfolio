export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");

	return prisma.project.delete({
		where: {
			id
		}
	});
});

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");

	return prisma.postSkeleton.delete({
		where: {
			id
		}
	});
});

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");

	return prisma.postSkeleton.findUnique({
		where: {
			id,
		},
	});
});

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");

	return notFoundIfMissing(
		prisma.postSkeleton.delete({
			where: {
				id,
			},
		}),
	);
});

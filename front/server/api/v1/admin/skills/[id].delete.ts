export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");

	return notFoundIfMissing(
		prisma.homeSkill.delete({
			where: {
				id,
			},
		}),
	);
});

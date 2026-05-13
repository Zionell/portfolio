export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");

	return  prisma.homeSkill.delete({
		where: {
			id
		}
	});
});

export default defineEventHandler(async (event) => {
	return  prisma.homeSkill.findMany({
		orderBy: {
			order: 'asc'
		}
	});
});

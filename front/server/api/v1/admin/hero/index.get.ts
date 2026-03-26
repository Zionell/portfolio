export default defineEventHandler(async (event) => {
	return  prisma.homeHero.findMany();
});

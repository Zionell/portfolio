export default defineEventHandler(async (event) => {
	return prisma.settingsScripts.findMany();
});

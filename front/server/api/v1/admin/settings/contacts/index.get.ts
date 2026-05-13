export default defineEventHandler(async (event) => {
	return prisma.settingsContacts.findMany();
});

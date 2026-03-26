export default defineEventHandler(async (event) => {
	return prisma.homeAbout.findUnique({
		where: {
			key: "main"
		}
	});
});

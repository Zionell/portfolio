export default defineEventHandler(async (event) => {
	return prisma.settingsSeo.findUnique({
		where: {
			key: "main",
		},
		include: {
			content: true,
		},
	});
});

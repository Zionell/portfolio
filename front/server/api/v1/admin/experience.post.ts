export default defineEventHandler(async (event) => {
	const body = await readBody<{ items?: Array<{ company: string; position: string; period: string; stack: string[]; responsibilities: string[] }> }>(event);

	if (!body?.items || !Array.isArray(body.items)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Items are required",
		});
	}

	const data = body.items.map((item, index) => ({
		company: item.company || "",
		position: item.position || "",
		period: item.period || "",
		stack: item.stack || [],
		responsibilities: item.responsibilities || [],
		order: index,
	}));

	await prisma.$transaction([
		prisma.homeExperience.deleteMany(),
		prisma.homeExperience.createMany({ data }),
	]);

	return { data: true };
});

export default defineEventHandler(async (event) => {
	const body = await readBody<{ image?: string; text?: string[] }>(event);

	if (!body?.image || !Array.isArray(body?.text)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Image and text are required",
		});
	}

	const record = await prisma.homeAbout.upsert({
		where: { key: "main" },
		update: {
			image: body.image,
			text: body.text,
		},
		create: {
			key: "main",
			image: body.image,
			text: body.text,
		},
	});

	return { data: record };
});

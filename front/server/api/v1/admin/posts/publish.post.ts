export default defineEventHandler(async (event) => {
	const body = await readBody<{ slug?: string }>(event);

	if (!body?.slug) {
		throw createError({
			statusCode: 400,
			statusMessage: "Slug is required",
		});
	}

	const record = await prisma.blogPost.update({
		where: { slug: body.slug },
		data: { status: "published" },
	});

	return { data: record };
});

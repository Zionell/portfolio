export default defineEventHandler(async (event) => {
	const body = await readBody<{
		slug?: string;
		title?: string;
		excerpt?: string;
		date?: string;
		tags?: string[];
		readTime?: number;
		cover?: string;
	}>(event);

	if (!body?.slug || !body?.title) {
		throw createError({
			statusCode: 400,
			statusMessage: "Slug and title are required",
		});
	}

	const record = await prisma.blogPost.upsert({
		where: { slug: body.slug },
		update: {
			title: body.title,
			excerpt: body.excerpt || "",
			date: body.date || "",
			tags: body.tags || [],
			readTime: body.readTime || 1,
			cover: body.cover || "",
			status: "draft",
		},
		create: {
			slug: body.slug,
			title: body.title,
			excerpt: body.excerpt || "",
			date: body.date || "",
			tags: body.tags || [],
			readTime: body.readTime || 1,
			cover: body.cover || "",
			status: "draft",
		},
	});

	return { data: record };
});

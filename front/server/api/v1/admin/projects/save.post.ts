export default defineEventHandler(async (event) => {
	const body = await readBody<{
		name?: string;
		slug?: string;
		link?: string;
		stack?: string[] | string;
		image?: string;
		order?: number | null;
		isDeveloping?: boolean;
		isArchived?: boolean;
	}>(event);

	if (!body?.slug || !body?.name) {
		throw createError({
			statusCode: 400,
			statusMessage: "Slug and name are required",
		});
	}

	const stack = Array.isArray(body.stack)
		? body.stack
		: typeof body.stack === "string"
			? body.stack
					.split(",")
					.map((item) => item.trim())
					.filter(Boolean)
			: [];

	const record = await prisma.project.upsert({
		where: { slug: body.slug },
		update: {
			name: body.name,
			link: body.link || "",
			stack,
			image: body.image || "",
			order: body.order ?? null,
			isDeveloping: Boolean(body.isDeveloping),
			isArchived: Boolean(body.isArchived),
		},
		create: {
			name: body.name,
			slug: body.slug,
			link: body.link || "",
			stack,
			image: body.image || "",
			order: body.order ?? null,
			isDeveloping: Boolean(body.isDeveloping),
			isArchived: Boolean(body.isArchived),
		},
	});

	return { data: record };
});

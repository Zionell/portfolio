import type { IFormDataPost } from "#shared/types/blog.types";

export default defineEventHandler(async (event) => {
	const body = await readBody<IFormDataPost>(event);

	if (!body?.slug || !body?.title) {
		throw createError({
			statusCode: 400,
			statusMessage: "Slug and title are required",
		});
	}

	if (!body?.type) {
		throw createError({
			statusCode: 400,
			statusMessage: "Type is required",
		});
	}

	const exists = await prisma.posts.findUnique({
		where: {
			slug: body.slug,
		},
	});

	if (exists) {
		throw createError({
			statusCode: 409,
			statusMessage: "Post with this slug already exists",
		});
	}

	const projectId = await resolveProjectId(body.projectId);

	// пост и отметка скелетона — вместе: иначе при битом skeletonId пост
	// создавался, а клиент получал 500 и сохранял повторно
	const post = await prisma.$transaction(async (tx) => {
		const created = await tx.posts.create({
			data: {
				slug: body.slug,
				title: body.title,
				excerpt: body.excerpt || "",
				date: todayDateString(),
				readTime: body.readTime || 1,
				cover: body.cover || "",
				lang: body.lang || "en",
				mainPage: body.mainPage || false,
				isPublished: body.isPublished || false,
				type: body.type,
				projectId,
				content: {
					create: normalizePostContent(body.content),
				},
			},
		});

		if (body.skeletonId) {
			await notFoundIfMissing(
				tx.postSkeleton.update({
					where: {
						id: body.skeletonId,
					},
					data: {
						isUsed: true,
					},
				}),
			);
		}

		return created;
	});

	return post;
});

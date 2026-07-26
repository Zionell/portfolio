import type { IFormDataPost } from "#shared/types/blog.types";

export default defineEventHandler(async (event) => {
	const body = await readBody<IFormDataPost>(event);

	if (!body?.slug || !body?.title) {
		throw createError({
			statusCode: 400,
			statusMessage: "Slug and title are required",
		});
	}

	if (!body?.typeId) {
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

	const post = await prisma.posts.create({
		data: {
			slug: body.slug,
			title: body.title,
			excerpt: body.excerpt || "",
			date: todayDateString(),
			tags: [],
			readTime: body.readTime || 1,
			cover: body.cover || "",
			lang: body.lang || "en",
			mainPage: body.mainPage || false,
			isPublished: body.isPublished || false,
			type: {
				connect: {
					id: body.typeId,
				},
			},
			content: {
				create: normalizePostContent(body.content),
			},
		},
	});

	if (body.skeletonId) {
		await prisma.postSkeleton.update({
			where: {
				id: body.skeletonId,
			},
			data: {
				isUsed: true,
			},
		});
	}

	return post;
});

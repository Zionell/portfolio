import type { IFormDataPost } from "#shared/types/blog.types";

export default defineEventHandler(async (event) => {
	const body = await readBody<IFormDataPost>(event);

	if (!body?.id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Id is required",
		});
	}

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

	const [current, sameSlug] = await Promise.all([
		prisma.posts.findUnique({
			where: {
				id: body.id,
			},
		}),
		prisma.posts.findUnique({
			where: {
				slug: body.slug,
			},
		}),
	]);

	if (!current) {
		throw createError({
			statusCode: 404,
			statusMessage: "Post not found",
		});
	}

	if (sameSlug && sameSlug.id !== body.id) {
		throw createError({
			statusCode: 409,
			statusMessage: "Post with this slug already exists",
		});
	}

	// Дата это дата публикации: проставляем в момент первой публикации
	const isFirstPublish = Boolean(body.isPublished) && !current.isPublished;

	// Блоки контента перезаписываем целиком: порядок и состав
	// задаются формой, точечный diff тут ничего не экономит.
	const [, post] = await prisma.$transaction([
		prisma.postContent.deleteMany({
			where: {
				postsId: body.id,
			},
		}),
		prisma.posts.update({
			where: {
				id: body.id,
			},
			data: {
				slug: body.slug,
				title: body.title,
				excerpt: body.excerpt || "",
				...(isFirstPublish ? { date: todayDateString() } : {}),
				readTime: body.readTime || 1,
				cover: body.cover || "",
				lang: body.lang || "en",
				mainPage: body.mainPage || false,
				isPublished: body.isPublished || false,
				type: body.type,
				content: {
					create: normalizePostContent(body.content),
				},
			},
		}),
	]);

	return post;
});

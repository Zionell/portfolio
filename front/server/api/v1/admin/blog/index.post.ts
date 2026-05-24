import type { Posts } from "~~/generated/prisma/client";

export default defineEventHandler(async (event) => {
	const body = await readBody<Partial<Posts>>(event);

	if (!body?.slug || !body?.title) {
		throw createError({
			statusCode: 400,
			statusMessage: "Slug and title are required",
		});
	}

	// await prisma.posts.create({
	// 	data: {
	// 		slug: body.slug,
	// 		title: body.title,
	// 		excerpt: body.excerpt || "",
	// 		date: body.date || "",
	// 		tags: body.tags || [],
	// 		readTime: body.readTime || 1,
	// 		cover: body.cover || "",
	// 		isPublished: body.isPublished || false,
	// 		mainPage: body.mainPage || false,
	// 		...(body.typeId
	// 			? {
	// 					typeId: {
	// 						connect: {
	// 							id: body.typeId,
	// 						},
	// 					},
	// 				}
	// 			: {}),
	// 	},
	// });

	return true;
});

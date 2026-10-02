export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");

	const current = await prisma.posts.findUnique({
		where: { id },
		select: { cover: true, content: { select: { image: true } } },
	});

	// Блоки контента живут отдельной таблицей, связь опциональная —
	// каскада нет, чистим руками
	const [, post] = await notFoundIfMissing(prisma.$transaction([
		prisma.postContent.deleteMany({
			where: {
				postsId: id,
			},
		}),
		prisma.posts.delete({
			where: {
				id,
			},
		}),
	]));

	if (current) {
		await deleteUploads([
			current.cover,
			...current.content.map((block) => block.image),
		]);
	}

	return post;
});

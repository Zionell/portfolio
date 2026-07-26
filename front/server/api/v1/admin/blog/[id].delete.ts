export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");

	// Блоки контента живут отдельной коллекцией, mongo не каскадит
	const [, post] = await prisma.$transaction([
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
	]);

	return post;
});

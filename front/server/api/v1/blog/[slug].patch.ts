export default defineEventHandler(async (event): Promise<void> => {
	const slug = getRouterParam(event, "slug");

	await prisma.posts.update({
		where: {
			slug: slug,
		},
		data: {
			views: {
				increment: 1,
			},
		},
	});
});

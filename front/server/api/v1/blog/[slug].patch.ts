export default defineEventHandler(async (event): Promise<void> => {
	const slug = getRouterParam(event, "slug") || "";

	if (!(await trackPostView(event, slug))) {
		throw createError({ statusCode: 404, statusMessage: "Post not found" });
	}
});

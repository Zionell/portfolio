export default defineEventHandler(async () => {
	const items = await prisma.postSkeleton.findMany({
		orderBy: { repo_name: "asc" },
	});

	return { data: items };
});

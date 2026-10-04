export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id") || "";

	const uploads = await findProjectUploads(id);

	const project = await notFoundIfMissing(
		prisma.project.delete({
			where: {
				id,
			},
		}),
	);

	await deleteUploads(uploads);

	return project;
});

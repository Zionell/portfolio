import type { IFormDataProject } from "#shared/types/project.types";

export default defineEventHandler(async (event) => {
	const body = await readBody<IFormDataProject>(event);

	if (!body.id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Project id is required",
		});
	}

	assertProjectBody(body);

	const before = await findProjectUploads(body.id);

	// блоки/скриншоты/ссылки пересоздаём целиком: форма присылает конечное
	// состояние списка, а не патч, и сопоставлять его по id дороже, чем
	// перезаписать десяток строк
	try {
		await prisma.$transaction([
			prisma.projectBlock.deleteMany({ where: { projectId: body.id } }),
			prisma.projectImage.deleteMany({ where: { projectId: body.id } }),
			prisma.projectLink.deleteMany({ where: { projectId: body.id } }),
			prisma.project.update({
				where: { id: body.id },
				data: {
					...projectScalars(body),
					...projectChildren(body),
					// set, а не connect: PickList отдаёт полный набор навыков,
					// снятые из него должны отвязываться
					stack: {
						set: projectStackIds(body),
					},
				},
			}),
		]);
	} catch (error) {
		rethrowProjectWriteError(error);
	}

	await deleteReplacedUploads(before, projectUploads(body));

	return true;
});

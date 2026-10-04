import type { IFormDataProject } from "#shared/types/project.types";

export default defineEventHandler(async (event) => {
	const body = await readBody<IFormDataProject>(event);

	assertProjectBody(body);

	try {
		await prisma.project.create({
			data: {
				...projectScalars(body),
				...projectChildren(body),
				stack: {
					connect: projectStackIds(body),
				},
			},
		});
	} catch (error) {
		rethrowProjectWriteError(error);
	}

	return true;
});

import type { IFormDataProject } from "#shared/types/project.types";

export default defineEventHandler(async (event) => {
	const body = await readBody<IFormDataProject>(event);

	await prisma.project.create({
		data: {
			name: body.name || "",
			slug: body.slug || "",
			link: body.link || "",
			image: body.image || "",
			order: body.order || 0,
			isDeveloping: body.isDeveloping || false,
			isArchived: body.isArchived || false,
			stack: {
				connect: body.stack.map((s) => ({ id: s.id })),
			},
		},
	});

	return true;
});

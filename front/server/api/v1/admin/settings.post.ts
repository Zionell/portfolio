import type { ISettings } from "#shared/types/settings.types";

export default defineEventHandler(async (event) => {
	const body = await readBody<ISettings>(event);

	if (!body?.contacts) {
		throw createError({
			statusCode: 400,
			statusMessage: "Contacts are required",
		});
	}

	const record = await prisma.settings.upsert({
		where: { key: "main" },
		update: {
			contacts: body.contacts || {},
			seo: body.seo || null,
			meta: body.meta || [],
			links: body.links || [],
			scripts: body.scripts || { scripts: [], noScripts: [] },
		},
		create: {
			key: "main",
			contacts: body.contacts || {},
			seo: body.seo || null,
			meta: body.meta || [],
			links: body.links || [],
			scripts: body.scripts || { scripts: [], noScripts: [] },
		},
	});

	return { data: record };
});

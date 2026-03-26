import type { HomeHero } from "~~/generated/prisma/client";

export default defineEventHandler(async (event) => {
	const body = await readBody<Partial<HomeHero>[]>(event);

	for (const item of body) {
		await prisma.homeHero.upsert({
			where: {
				lang: item.lang,
			},
			update: {
				title: item.title,
				subtitle: item.subtitle,
			},
			create: {
				lang: item.lang,
				title: item.title || "",
				subtitle: item.subtitle || "",
			},
		});
	}

	return true;
});

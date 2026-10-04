import type { HomeHero } from "~~/generated/prisma/client";

export default defineEventHandler(async (event) => {
	const body = await readBody<Partial<HomeHero>[]>(event);

	for (const item of body) {
		if (!item.lang) continue;

		const itemData = {
			// выводятся через v-html
			title: sanitizePostHtml(item.title),
			subtitle: sanitizePostHtml(item.subtitle),
			availabilityStatus: item.availabilityStatus || "",
			availabilityFacts: (item.availabilityFacts || [])
				.map((fact) => fact.trim())
				.filter(Boolean),
		};

		await prisma.homeHero.upsert({
			where: {
				lang: item.lang,
			},
			update: itemData,
			create: {
				lang: item.lang,
				...itemData,
			},
		});
	}

	return true;
});

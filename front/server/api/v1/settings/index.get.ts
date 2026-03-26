import type { Noscript, Script } from "unhead/types";

export default defineEventHandler(async (event): Promise<ISettings> => {
	const stored = await prisma.settings.findUnique({
		where: { key: "main" },
	});

	if (stored) {
		return {
			contacts: (stored.contacts as ISettings["contacts"]) || {},
			seo: (stored.seo as ISettings["seo"]) || undefined,
			meta: (stored.meta as ISettings["meta"]) || [],
			links: (stored.links as ISettings["links"]) || [],
			scripts: (stored.scripts as Script[]) || [],
			noScripts: (stored.noScripts as Noscript[]) || [],
		};
	}
});

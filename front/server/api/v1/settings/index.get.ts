import type { Noscript, Script } from "unhead/types";

export default defineEventHandler(async (event): Promise<ISettings> => {
	const cookies = parseCookies(event);
	const curLang = cookies["i18n_redirected"] || "en";

	const [resContacts, resSeo, resScripts] = await prisma.$transaction([
		prisma.settingsContacts.findMany(),
		prisma.settingsSeo.findUnique({
			where: {
				key: "main"
			},
			include: {
				content: {
					where: {
						lang: curLang
					}
				}
			}
		}),
		prisma.settingsScripts.findMany(),
	]);

	const scripts: Script[] = [];
	const noScripts: Noscript[] = [];

	resScripts?.forEach((script) => {
		if (script.type === "script") {
			scripts.push(script);
		} else {
			noScripts.push(script);
		}
	});

	return {
		contacts: (resContacts as ISettings["contacts"]) || {},
		seo: (resSeo as ISettings["seo"]) || undefined,
		// meta: (stored.meta as ISettings["meta"]) || [],
		// links: (stored.links as ISettings["links"]) || [],
		scripts: scripts,
		noScripts: noScripts,
	};
});

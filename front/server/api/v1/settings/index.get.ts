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
		const tag = {
			innerHTML: script.innerHTML,
			tagPosition: script.body ? ("bodyClose" as const) : ("head" as const),
		};

		// async у inline-скрипта браузер игнорирует, он работает только с src
		if (script.type === "script") {
			scripts.push(tag);
		} else {
			noScripts.push(tag);
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

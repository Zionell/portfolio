import type { SettingsScripts } from "~~/generated/prisma/client";

export default defineEventHandler(async (event) => {
	const body = await readBody<Partial<SettingsScripts>[]>(event);

	for (const item of body) {
		const itemData = {
			type: item.type || "",
			innerHTML: item.innerHTML || "",
			async: item.async || false,
			body: item.body || false,
		};

		if (item?.id) {
			await prisma.settingsScripts.update({
				where: { id: item.id },
				data: itemData,
			});
		} else {
			await prisma.settingsScripts.create({
				data: itemData,
			});
		}
	}

	return body;
});

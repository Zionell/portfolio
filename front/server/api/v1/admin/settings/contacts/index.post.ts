import type {
	SettingsContacts,
} from "~~/generated/prisma/client";

export default defineEventHandler(async (event) => {
	const body = await readBody<Partial<SettingsContacts>[]>(event);

	for (const item of body) {
		const itemData = {
			name: item.name || "",
			link: item.link || "",
		};

		if (item?.id) {
			await prisma.settingsContacts.update({
				where: { id: item.id },
				data: itemData,
			});
		} else {
			await prisma.settingsContacts.create({
				data: itemData,
			});
		}
	}

	return body;
});

import type { IContacts } from "#shared/types/contact.types";

export default defineEventHandler(async (event): Promise<IContacts> => {
	const cookies = parseCookies(event);
	const curLang = cookies["i18n_redirected"] || "en";

	const [resContacts, contactsHero] = await prisma.$transaction([
		prisma.settingsContacts.findMany(),
		prisma.contactsHero.findUnique({
			where: {
				lang: curLang,
			},
		}),
	]);

	return {
		contacts: (resContacts as ISettings["contacts"]) || {},
		hero: contactsHero,
	};
});

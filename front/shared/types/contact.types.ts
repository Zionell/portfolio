import type { ContactsHero } from "~~/generated/prisma/client";

export interface IContacts {
	hero: ContactsHero | null;
	contacts: ISettings["contacts"];
}

export interface IContactFormPayload {
	name: string;
	email: string;
	message: string;
}

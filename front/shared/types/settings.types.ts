import type { Script, Noscript, Meta, Link } from "unhead/types";
import type {
	SettingsContacts,
	SettingsSeo,
	SettingsSeoContent,
} from "~~/generated/prisma/client";

export interface ISettingsSeo extends SettingsSeo {
	content: SettingsSeoContent[];
}

export interface ISettings {
	contacts: SettingsContacts[];
	seo: ISettingsSeo;

	meta?: Meta[];
	links?: Link[];
	scripts: Script[];
	noScripts: Noscript[];
}

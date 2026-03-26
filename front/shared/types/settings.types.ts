import type {Script, Noscript, Meta, Link} from 'unhead/types'

export interface ISocial {
	name: string;
	icon: string;
	link: string;
}

export interface ISettings {
	contacts: {
		email?: string;
		phone?: string;
		social?: ISocial[];
	};
	seo?: {
		title: string;
		description: string;
		link: string;
		image: string;
		author: string;
	};
	meta?: Meta[];
	links?: Link[];
	scripts: Script[];
	noScripts: Noscript[];
}

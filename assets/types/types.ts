export interface IEnv {
	SERVER_API: string;
	DEVELOPMENT: boolean;
}

export interface ISpec {
	value: string;
	label: string;
}

export interface IContact {
	name: string;
	icon: string;
	link: string;
}

export interface ISkill {
	icon: string;
	label: string;
}

export interface ISkills {
	title: string;
	items: ISkill[];
}

export interface IWorkCard {
	link?: string;
	name: string;
	stack: string[];
	slug: string;
	isDeveloping?: boolean;
	isArchived?: boolean;
}

export interface IExperience {
	company: string;
	position: string;
	period: string;
	stack: string[];
	responsibilities: string[];
}

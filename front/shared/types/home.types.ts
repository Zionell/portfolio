import type {
	BlogPost,
	HomeAbout,
	HomeAboutText,
	HomeExperience,
	HomeHero,
	HomeSkill,
	Project,
} from "~~/generated/prisma/client";

export interface IAbout extends HomeAbout {
	text: HomeAboutText[];
}

export interface IHomeExperience extends HomeExperience {
	stack: Array<{
		label: string;
	}>;
}

export interface IHomeProject extends Project {
	stack: Array<{
		label: string;
	}>;
}

export interface IHomeData {
	hero: HomeHero | null;
	about: IAbout | null;
	experience: IHomeExperience[];
	skills: HomeSkill[];
	projects: IHomeProject[];
	blog: BlogPost[];
}

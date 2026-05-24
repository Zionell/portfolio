import type {
	Posts,
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

export interface IHomeExperience extends Partial<HomeExperience> {
	stack: string[];
	company: string;
	position: string;
	responsibilities: string;
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
	blog: Posts[];
}

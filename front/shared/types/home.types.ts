import type {
	BlogPost,
	HomeAbout,
	HomeExperience,
	HomeHero,
	HomeSkill,
	Project,
} from "~~/generated/prisma/client";

export interface IHomeData {
	hero: HomeHero | null;
	about: HomeAbout | null;
	experience: HomeExperience[];
	skills: HomeSkill[];
	projects: Project[];
	blog: BlogPost[];
}

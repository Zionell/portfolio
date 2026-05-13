import type { HomeExperience, HomeSkill } from "~~/generated/prisma/client";

export interface IExperience extends HomeExperience {
	stack: HomeSkill[];
}

export interface IResponseExp {
	experience: IExperience[];
	skills: HomeSkill[];
}

export interface IFormDataExp extends Partial<HomeExperience> {
	stack: HomeSkill[];
}

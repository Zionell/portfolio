import type {
	HomeSkill,
	Project,
} from "~~/generated/prisma/client";

export interface IProject extends Project {
	stack: HomeSkill[];
}

export interface IResponseProject {
	project: IProject | null;
	skills: HomeSkill[];
}

export interface IFormDataProject extends Partial<Project> {
	stack: HomeSkill[];
}

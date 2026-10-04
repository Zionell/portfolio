import type {
	HomeSkill,
	Project,
	ProjectBlock,
	ProjectImage,
	ProjectLink,
} from "~~/generated/prisma/client";

export interface IProject extends Project {
	stack: HomeSkill[];
	blocks: ProjectBlock[];
	images: ProjectImage[];
	links: ProjectLink[];
}

export interface IProjectCard extends Project {
	stack: Array<{
		label: string;
	}>;
	hasDetail: boolean;
}

export interface IResponseProject {
	project: IProject | null;
	skills: HomeSkill[];
}

export interface IFormDataProject extends Partial<Project> {
	stack: HomeSkill[];
	blocks: Partial<ProjectBlock>[];
	images: Partial<ProjectImage>[];
	links: Partial<ProjectLink>[];
}

export interface IProjectDetailBlock {
	id: string;
	title: string;
	text: string;
}

export interface IProjectDetailImage {
	id: string;
	image: string;
	caption: string;
	isWide: boolean;
}

export interface IProjectDetailLink {
	id: string;
	label: string;
	url: string;
}

export interface IProjectDetail {
	id: string;
	name: string;
	slug: string;
	image: string | null;
	link: string;
	eyebrow: string;
	description: string;
	isDeveloping: boolean;
	isArchived: boolean;
	stack: string[];
	blocks: IProjectDetailBlock[];
	images: IProjectDetailImage[];
	links: IProjectDetailLink[];
}

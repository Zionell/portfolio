import type { IPaginateQuery } from "#shared/types/common.types";
import type {
	Posts,
	PostContent,
	PostSkeleton,
	Project,
} from "~~/generated/prisma/client";

export type IPostProject = Pick<Project, "id" | "name" | "slug">;

export type IPublicPostProject = Pick<Project, "name" | "slug" | "showDetail">;

export interface IPostWithProject extends Posts {
	project?: IPublicPostProject | null;
}

export interface ISkeletonAdmin extends PostSkeleton {
	project: IPostProject | null;
}

export interface IBlogQuery extends IPaginateQuery {
	type?: string;
	project?: string;
}

export interface IBlogListAdmin {
	skeletons: ISkeletonAdmin[];
	posts: Posts[];
	projects: IPostProject[];
}

export interface IPostAdmin extends Posts {
	content: PostContent[];
}

export interface IFormDataPostContent {
	id?: string;
	text?: string | null;
	image?: string | null;
	video?: string | null;
	order: number;
}

// date и tags форма не отправляет: дату публикации ставит сервер
export interface IFormDataPost {
	id?: string;
	slug: string;
	title: string;
	excerpt: string;
	readTime: number;
	cover: string;
	lang: string;
	mainPage: boolean;
	isPublished: boolean;
	type: string;
	content: IFormDataPostContent[];
	projectId?: string | null;
	skeletonId?: string | null;
}

export interface IFormDataSkeleton {
	title: string;
	body: string;
	lang: string;
	projectId?: string | null;
	commits?: string | null;
	repo_name?: string | null;
}

export interface IGenerateDraftBody {
	title: string;
	excerpt: string;
	lang: string;
	skeletonId?: string | null;
}

export interface IGeneratedDraft {
	title: string;
	excerpt: string;
	content: string;
	readTime: number;
	cover: string;
}

export interface IResponsePostAdmin {
	post: IPostAdmin | null;
	skeleton: PostSkeleton | null;
	projects: IPostProject[];
}

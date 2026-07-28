import type { IPaginateQuery } from "#shared/types/common.types";
import type {
	Posts,
	PostContent,
	PostSkeleton,
} from "~~/generated/prisma/client";

export interface IBlogQuery extends IPaginateQuery {
	type?: string;
	project?: string;
}

export interface IBlogListAdmin {
	skeletons: PostSkeleton[];
	posts: Posts[];
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
	skeletonId?: string | null;
}

export interface IResponsePostAdmin {
	post: IPostAdmin | null;
	skeleton: PostSkeleton | null;
}

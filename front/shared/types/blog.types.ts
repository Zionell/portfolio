import type { IPaginateQuery } from "#shared/types/common.types";
import type { Posts, PostSkeleton } from "~~/generated/prisma/client";

export interface IBlogQuery extends IPaginateQuery {
	type?: string;
	project?: string;
}

export interface IBlogListAdmin {
	skeletons: PostSkeleton[];
	posts: Posts[];
}

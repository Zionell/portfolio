import type { IPaginateQuery } from "#shared/types/common.types";

export interface IBlogQuery extends IPaginateQuery {
	type?: string;
	project?: string;
}

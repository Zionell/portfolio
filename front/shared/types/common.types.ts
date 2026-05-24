export interface IMenuItem {
	key: string;
	value: string;
}

export interface IPaginateQuery {
	page: number;
	limit: number;
}

export interface IPaginatedData<T> {
	hasNext: boolean;
	count: number;
	data: T[];
}

export interface ITag {
	label: string;
	color: Colors;
}

export enum Colors {
	WARNING = "warning",
	ERROR = "error",
}

export interface ISpec {
	label: string;
	value: string;
}

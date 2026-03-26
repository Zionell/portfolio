export interface ISpec {
	label: string;
	value: string;
}

export interface IPaginateQuery {
	offset: number;
	limit: number;
}

export interface IPaginatedData<T> {
	hasNext: boolean;
	count: number;
	data: T[];
}

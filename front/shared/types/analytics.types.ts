export interface IAnalyticsSummary {
	visits: number;
	bots: number;
	postViews: number;
	errors: number;
}

export interface IAnalyticsDay {
	date: string;
	visits: number;
	postViews: number;
}

export interface IAnalyticsTopPost {
	id: string;
	title: string;
	slug: string;
	views: number;
}

export interface IAnalyticsOverview {
	days: number;
	summary: IAnalyticsSummary;
	daily: IAnalyticsDay[];
	topPosts: IAnalyticsTopPost[];
}

export interface IPostGenerationError {
	id: string;
	source: string;
	message: string;
	createdAt: string;
}

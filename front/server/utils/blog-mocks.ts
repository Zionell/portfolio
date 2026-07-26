import type { Posts } from "~~/generated/prisma/client";
import type { ISpec } from "#shared/types/common.types";

export const MOCK_TYPE_POST = "mock-post";
export const MOCK_TYPE_NEWS = "mock-news";

export const mockBlogSpecs = (lang: string): ISpec[] => [
	{
		value: MOCK_TYPE_POST,
		label: lang === "ru" ? "Посты" : "Posts",
	},
	{
		value: MOCK_TYPE_NEWS,
		label: lang === "ru" ? "Новости" : "News",
	},
];

const IMG_BASE = "https://askarov.dev/images/projects/";

interface IMockSeed {
	type: "post" | "news";
	date: string;
	title: string;
	excerpt: string;
	project: string;
	read: number;
	cover?: string;
}

const seeds: IMockSeed[] = [
	{
		type: "news",
		date: "2026-07-01",
		title: "LiveSimply hits public beta",
		excerpt:
			"The habit-and-budget tracker is now open for everyone: new onboarding, charts on Chart.js and a fully typed API on NestJS + Prisma.",
		project: "LiveSimply",
		read: 3,
		cover: `${IMG_BASE}livesimply.jpg`,
	},
	{
		type: "post",
		date: "2026-06-15",
		title: "Designing a dashboard architecture with Nuxt 3 + Pinia",
		excerpt:
			"How AV-Dashboard is structured: feature-sliced modules, typed stores, and why I moved all data-fetching into composables.",
		project: "AV-Dashboard",
		read: 8,
		cover: `${IMG_BASE}dachboard.jpg`,
	},
	{
		type: "post",
		date: "2026-06-01",
		title: "GSAP scroll animations without killing performance",
		excerpt:
			"ScrollTrigger patterns I use in production: transform-only tweens, will-change discipline and reduced-motion fallbacks.",
		project: "",
		read: 6,
	},
	{
		type: "news",
		date: "2026-05-01",
		title: "Nomad Backpacker: route planner MVP shipped",
		excerpt:
			"First public milestone — country guides, budget calculator and offline route export. NestJS + Prisma under the hood.",
		project: "Nomad Backpacker",
		read: 2,
		cover: `${IMG_BASE}nomad.jpg`,
	},
	{
		type: "post",
		date: "2026-04-01",
		title: "Zod on the boundary: validating everything twice",
		excerpt:
			"One schema for the API and the form: how shared Zod schemas removed a whole class of runtime bugs in LiveSimply.",
		project: "LiveSimply",
		read: 7,
		cover: `${IMG_BASE}livesimply.jpg`,
	},
	{
		type: "post",
		date: "2026-03-01",
		title: "From Team Lead back to hands-on: what I learned",
		excerpt:
			"A year of leading a frontend team at Idaproject — planning, interviews, reviews — and why I still write code every day.",
		project: "",
		read: 5,
	},
	{
		type: "news",
		date: "2026-02-01",
		title: "AV-Dashboard: dark theme and MySQL migration",
		excerpt:
			"The dashboard got a full token-based dark theme and moved part of the storage from MongoDB to MySQL via Prisma.",
		project: "AV-Dashboard",
		read: 2,
		cover: `${IMG_BASE}dachboard.jpg`,
	},
	{
		type: "post",
		date: "2026-01-01",
		title: "Mapbox + Vue: 60fps maps with thousands of markers",
		excerpt:
			"Clustering, canvas layers and a Pinia-driven viewport store — the setup that kept the map smooth on real-estate portals.",
		project: "",
		read: 9,
	},
	{
		type: "news",
		date: "2025-12-01",
		title: "Joined Kelnik Studios as Senior Frontend Developer",
		excerpt:
			"New chapter: senior developer on large real-estate products, mentoring and performance work on Nuxt.",
		project: "",
		read: 1,
	},
];

export interface IMockPostContent {
	id: string;
	text: string | null;
	image: string | null;
	video: string | null;
	order: number;
	postsId: string;
	createdAt: Date;
	updatedAt: Date;
}

export const mockBlogPosts: Posts[] = seeds.map((seed, ind) => ({
	id: `mock-${ind + 1}`,
	slug: `mock-${ind + 1}`,
	title: seed.title,
	excerpt: seed.excerpt,
	date: seed.date,
	tags: seed.project ? [seed.project] : [],
	readTime: seed.read,
	cover: seed.cover || null,
	mainPage: true,
	isPublished: true,
	lang: "en",
	createdAt: new Date(seed.date),
	updatedAt: new Date(seed.date),
	typeId: seed.type === "news" ? MOCK_TYPE_NEWS : MOCK_TYPE_POST,
}));

export const getMockBlogPost = (
	slug: string,
): (Posts & { content: IMockPostContent[] }) | null => {
	const post = mockBlogPosts.find((p) => p.slug === slug);

	if (!post) return null;

	const block = (order: number, text?: string, image?: string) => ({
		id: `${post.id}-content-${order}`,
		text: text || null,
		image: image || null,
		video: null,
		order,
		postsId: post.id,
		createdAt: post.createdAt,
		updatedAt: post.updatedAt,
	});

	const content: IMockPostContent[] = [
		block(
			0,
			`<p>${post.excerpt}</p><p>This is a mock post — real content will appear here once articles are published through the admin panel. The layout below shows how headings, paragraphs, lists and images are rendered.</p>`,
		),
		block(
			1,
			`<h2>Why it matters</h2><p>Every product decision leaves a trace in the codebase. Writing things down forces clarity: what problem was solved, what trade-offs were made, and what I would do differently next time.</p>`,
		),
	];

	if (post.cover) {
		content.push(block(2, undefined, post.cover));
	}

	content.push(
		block(
			3,
			`<h2>Key takeaways</h2><ul><li>Ship small, measure, iterate.</li><li>Types on the boundary save hours of debugging.</li><li>Performance is a feature, not an afterthought.</li></ul><p>Thanks for reading — more posts are on the way.</p>`,
		),
	);

	return { ...post, content };
};

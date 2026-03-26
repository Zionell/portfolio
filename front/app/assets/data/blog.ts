
const defaultCover = "/images/default.png";

export const blog = [
	{
		id: 1,
		slug: "nuxt-portfolio-launch",
		title: "Portfolio v2 launch",
		excerpt:
			"New layout, smoother animations, and a cleaner structure for future case studies.",
		date: "2026-02-18",
		tags: ["News", "Portfolio"],
		readTime: 3,
		cover: defaultCover,
	},
	{
		id: 2,
		slug: "gsap-scroll-habits",
		title: "Scroll animations: the rules I follow",
		excerpt:
			"Simple patterns that keep motion smooth without hurting readability or performance.",
		date: "2026-02-27",
		tags: ["Post", "GSAP"],
		readTime: 4,
		cover: defaultCover,
	},
	{
		id: 3,
		slug: "case-study-briefs",
		title: "How I structure case‑study briefs",
		excerpt:
			"A lightweight template that helps me ship faster and keep focus on outcomes.",
		date: "2026-03-05",
		tags: ["Article", "Process"],
		readTime: 6,
		cover: defaultCover,
	},
	{
		id: 4,
		slug: "design-to-code-notes",
		title: "Design‑to‑code notes from real projects",
		excerpt:
			"Things that repeatedly save time when translating Figma to production UI.",
		date: "2026-03-08",
		tags: ["Post", "Figma"],
		readTime: 5,
		cover: defaultCover,
	},
	{
		id: 5,
		slug: "freelance-process-update",
		title: "Freelance process update",
		excerpt:
			"New intake flow, clearer timelines, and better hand‑off deliverables.",
		date: "2026-03-10",
		tags: ["News", "Freelance"],
		readTime: 2,
		cover: defaultCover,
	},
	{
		id: 6,
		slug: "ui-craft-checklist",
		title: "UI craft checklist",
		excerpt:
			"The short list I run before shipping a UI to make it feel intentional.",
		date: "2026-03-11",
		tags: ["Article", "UI"],
		readTime: 7,
		cover: defaultCover,
	},
	{
		id: 7,
		slug: "nomadbackpacker-scope",
		title: "NomadBackpacker: scope and first sprint",
		excerpt:
			"Defined the MVP, set the content structure, and drafted the first UI routes.",
		date: "2026-03-12",
		tags: ["Post", "NomadBackpacker"],
		readTime: 4,
		cover: defaultCover,
	},
	{
		id: 8,
		slug: "nomadbackpacker-ui-system",
		title: "NomadBackpacker: UI system setup",
		excerpt:
			"Chose the layout grid, tuned typography, and created reusable sections.",
		date: "2026-03-12",
		tags: ["Post", "NomadBackpacker"],
		readTime: 5,
		cover: defaultCover,
	},
	{
		id: 9,
		slug: "sportclub-landing",
		title: "SportClub: landing page iteration",
		excerpt:
			"Updated hero composition, improved CTA hierarchy, and refined card spacing.",
		date: "2026-03-09",
		tags: ["News", "SportClub"],
		readTime: 3,
		cover: defaultCover,
	},
	{
		id: 10,
		slug: "mogo-layout-structure",
		title: "Mogo: layout structure notes",
		excerpt:
			"Split the page into atomic blocks and optimized the visual rhythm.",
		date: "2026-03-07",
		tags: ["Article", "Mogo"],
		readTime: 4,
		cover: defaultCover,
	},
	{
		id: 11,
		slug: "rendezvous-visual-balance",
		title: "Rendezvous: visual balance tests",
		excerpt:
			"Explored typography weight and contrast to keep the hero readable.",
		date: "2026-03-06",
		tags: ["Post", "Rendezvous"],
		readTime: 3,
		cover: defaultCover,
	},
];

const tagsList: string[] = blog.map((post) => post.tags[0] || '');

export const blogTags = ["All", ...tagsList];

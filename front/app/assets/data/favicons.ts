interface faviconItem {
	rel?: string;
	href?: string;
	sizes?: string;
	type?: string;
	crossorigin?: string;
	color?: string;
}

interface metaItem {
	name?: string;
	content?: string;
	charset?: string;
	[key: `data-${string}`]: string;
}

type favIcons = faviconItem[];
type headMetas = metaItem[];

const faviconsLinks: favIcons = [
	{
		rel: "icon",
		href: "/favicons/favicon.ico",
	},
	{
		rel: "apple-touch-icon",
		href: "/favicons/apple-touch-icon.png",
		sizes: "180x180",
	},
	{
		rel: "icon",
		href: "/favicons/favicon-96x96.png",
		sizes: "96x96",
		type: "image/png",
	},
	{
		rel: "manifest",
		href: "/favicons/site.webmanifest",
		crossorigin: "use-credentials",
	},
];

const faviconsMeta: headMetas = [
	{
		name: "msapplication-TileColor",
		content: "#111",
	},
	{
		name: "theme-color",
		content: "#111",
	},
];

export { faviconsLinks, faviconsMeta };

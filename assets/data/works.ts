import type { IWorkCard } from "~/assets/interfaces/interface";

export const works: IWorkCard[] = [
	{
		name: "Sarawan",
		slug: "sarawan",
		stack: ["react", "redux", "sass"],
		isArchived: true,
	},
	{
		name: "LiveSimply",
		slug: "livesimply",
		stack: ["nextjs", "ts", "tailwindcss", "prisma"],
		link: "https://live-simply.ru",
		isDeveloping: true,
	},
	{
		name: "Nomad backpacker",
		slug: "nomad",
		stack: ["nuxt", "nestjs", "ts", "tailwindcss", "prisma"],
		// link: 'https://nomad-backpacker.com/',
		link: "https://nomad-backpacker.vercel.app/",
		isDeveloping: true,
	},
	{
		name: "Спортивный клуб",
		slug: "skshag",
		stack: ["nuxt", "vue", "sass"],
		link: "https://skshag.ru/",
	},
	// {
	//     name: 'Portfolio',
	//     slug: 'lyaman',
	//     stack: ['nuxt', 'vue', 'sass', 'axios', 'strapi'],
	//     link: 'https://lyaman-askerova.kz/',
	//     isDeveloping: true
	// },
	{
		name: "AV-Dachboard",
		slug: "dachboard",
		stack: ["nuxt", "vue", "sass", "nodejs", "sequelize", "mysql"],
		link: "https://dashboard.askarov.dev/",
		isDeveloping: true,
	},
	{
		name: "MoGo",
		slug: "mogo",
		stack: ["angular"],
		link: "https://mogo-lyart.vercel.app/",
	},
	{
		name: "Topogeo",
		slug: "topogeo",
		stack: ["html", "css", "js"],
		link: "https://zionell.github.io/Topogeo/",
	},
	{
		name: "Online-shop The Brand",
		slug: "the-brand",
		stack: ["html", "css", "js"],
		link: "https://zionell.github.io/The-brand/",
	},
	{
		name: "Rendered",
		slug: "rendered",
		stack: ["html", "css"],
		link: "https://zionell.github.io/rendered/",
	},
];

import type { IHomeData } from "#shared/types/home.types";

export default defineEventHandler(async (event): Promise<IHomeData> => {
	const cookies = parseCookies(event);
	const curLang = cookies["i18n_redirected"] || "en";

	const [hero, about, experience, skills, projects, posts] =
		await Promise.all([
			prisma.homeHero.findUnique({
				where: {
					lang: curLang,
				},
			}),
			prisma.homeAbout.findUnique({
				where: {
					key: 'main',
				},
				include:  {
					text: {
						where: { lang: curLang },
					}
				}
			}),
			prisma.homeExperience.findMany({
				where: {
					lang: curLang,
				},
				orderBy: { order: "asc" },
			}),
			prisma.homeSkill.findMany({
				orderBy: { order: "asc" },
			}),
			prisma.project.findMany({
				where: {
					lang: curLang,
				},
				orderBy: { order: "asc" },
			}),
			prisma.blogPost.findMany({
				orderBy: { updatedAt: "asc" },
				where: {
					lang: curLang,
					status: "published",
					mainPage: true,
				},
				take: 3
			}),
		]);

	return {
		hero: hero || null,
		about: about || null,
		experience: experience.length ? experience : [],
		skills: skills.length ? skills : [],
		projects: projects.length ? projects : [],
		blog: posts.length ? posts : [],
	};
});

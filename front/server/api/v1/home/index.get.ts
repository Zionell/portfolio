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
					key: "main",
				},
				include: {
					text: {
						where: { lang: curLang },
					},
				},
			}),
			prisma.homeExperience.findMany({
				orderBy: { order: "asc" },
				include: {
					stack: {
						select: {
							label: true,
						},
					},
				},
			}),
			prisma.homeSkill.findMany({
				orderBy: { order: "asc" },
			}),
			prisma.project.findMany({
				orderBy: { order: "asc" },
				include: {
					stack: {
						select: {
							label: true,
						},
					},
				},
			}),
			prisma.posts.findMany({
				orderBy: { updatedAt: "asc" },
				where: {
					lang: curLang,
					isPublished: true,
					mainPage: true,
				},
				take: 3,
			}),
		]);

	const prepareExp = experience?.map((exp) => {
		return {
			id: exp.id,
			startDate: exp.startDate,
			endDate: exp.endDate,
			isPresent: exp.isPresent,
			order: exp.order,
			company:
				exp?.[`company_${curLang}` as keyof typeof exp]?.toString() ||
				"",
			position:
				exp?.[`position_${curLang}` as keyof typeof exp]?.toString() ||
				"",
			responsibilities:
				exp?.[
					`responsibilities_${curLang}` as keyof typeof exp
				]?.toString() || "",
			stack: exp.stack.map((s) => s.label),
		};
	});

	return {
		hero: hero || null,
		about: about || null,
		experience: prepareExp.length ? prepareExp : [],
		skills: skills.length ? skills : [],
		projects: projects.length ? projects : [],
		blog: posts.length ? posts : [],
	};
});

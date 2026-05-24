import type { ISpec } from "#shared/types/common.types";

export default defineEventHandler(async (event): Promise<ISpec[]> => {
	const cookies = parseCookies(event);
	const curLang = cookies["i18n_redirected"] || "en";

	const blogs = await prisma.postsType.findMany({
		where: {
			posts: {
				some: {
					isPublished: true,
				},
			},
		},
	});

	const labelKey = `label_${curLang}` as keyof typeof PostsType;

	return blogs.map(
		(b): ISpec => ({
			value: b.id,
			label: b[labelKey] || b.label_en,
		}),
	);
});

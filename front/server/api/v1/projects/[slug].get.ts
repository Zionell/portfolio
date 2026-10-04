import type { IProjectDetail } from "#shared/types/project.types";

export default defineEventHandler(async (event): Promise<IProjectDetail> => {
	const slug = getRouterParam(event, "slug");
	const cookies = parseCookies(event);
	const curLang = cookies["i18n_redirected"] || "en";

	if (!slug) {
		throw createError({ statusCode: 404, statusMessage: "Not Found" });
	}

	const project = await prisma.project.findUnique({
		where: { slug },
		include: {
			stack: { select: { label: true } },
			blocks: { orderBy: { order: "asc" } },
			images: { orderBy: { order: "asc" } },
			links: { orderBy: { order: "asc" } },
		},
	});

	if (!project?.showDetail) {
		throw createError({ statusCode: 404, statusMessage: "Not Found" });
	}

	// у языка может не быть перевода — тогда падаем на английский,
	// пустая страница хуже страницы на втором языке
	const pick = (ru: string | null, en: string | null): string =>
		(curLang === "ru" ? ru || en : en || ru) || "";

	return {
		id: project.id,
		name: project.name,
		slug: project.slug,
		image: project.image,
		link: project.link,
		eyebrow: pick(project.eyebrow_ru, project.eyebrow_en),
		description: pick(project.description_ru, project.description_en),
		isDeveloping: project.isDeveloping,
		isArchived: project.isArchived,
		stack: project.stack.map((s) => s.label),
		blocks: project.blocks.map((block) => ({
			id: block.id,
			title: pick(block.title_ru, block.title_en),
			text: pick(block.text_ru, block.text_en),
		})),
		images: project.images.map((image) => ({
			id: image.id,
			image: image.image,
			caption: pick(image.caption_ru, image.caption_en),
			isWide: image.isWide,
		})),
		links: project.links.map((link) => ({
			id: link.id,
			label: pick(link.label_ru, link.label_en),
			url: link.url,
		})),
	};
});

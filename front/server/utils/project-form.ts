import type { IFormDataProject } from "#shared/types/project.types";

const cleanList = (list?: string[] | null): string[] =>
	(list || []).map((item) => item.trim()).filter(Boolean);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const assertProjectBody = (body: IFormDataProject) => {
	if (!(body.name || "").trim()) {
		throw createError({
			statusCode: 400,
			statusMessage: "Название проекта обязательно",
		});
	}

	const slug = (body.slug || "").trim();

	if (!slug) {
		throw createError({
			statusCode: 400,
			statusMessage: "Слаг обязателен: по нему строится адрес страницы",
		});
	}

	if (!SLUG_PATTERN.test(slug)) {
		throw createError({
			statusCode: 400,
			statusMessage:
				"В слаге допустимы строчные латинские буквы, цифры и дефис",
		});
	}
};

export const rethrowProjectWriteError = (error: unknown): never => {
	if ((error as { code?: string })?.code === "P2002") {
		throw createError({
			statusCode: 409,
			statusMessage: "Проект с таким слагом уже есть",
		});
	}

	throw error;
};

export const projectScalars = (body: IFormDataProject) => ({
	name: (body.name || "").trim(),
	slug: (body.slug || "").trim(),
	link: body.link || "",
	image: body.image || "",
	order: body.order || 0,
	mainPage: body.mainPage || false,
	isDeveloping: body.isDeveloping || false,
	isArchived: body.isArchived || false,
	showDetail: body.showDetail || false,
	eyebrow_en: body.eyebrow_en || "",
	eyebrow_ru: body.eyebrow_ru || "",
	description_en: body.description_en || "",
	description_ru: body.description_ru || "",
});

export const projectChildren = (body: IFormDataProject) => ({
	blocks: {
		create: (body.blocks || []).map((block, ind) => ({
			order: ind,
			title_en: block.title_en || "",
			title_ru: block.title_ru || "",
			text_en: block.text_en || "",
			text_ru: block.text_ru || "",
		})),
	},
	images: {
		create: (body.images || [])
			.filter((image) => image.image)
			.map((image, ind) => ({
				order: ind,
				image: image.image as string,
				caption_en: image.caption_en || "",
				caption_ru: image.caption_ru || "",
				isWide: image.isWide || false,
			})),
	},
	links: {
		create: (body.links || [])
			.filter((link) => link.url)
			.map((link, ind) => ({
				order: ind,
				label_en: link.label_en || "",
				label_ru: link.label_ru || "",
				url: link.url as string,
			})),
	},
});

// Все загруженные картинки проекта: обложка и скриншоты
export const projectUploads = (project: {
	image?: string | null;
	images?: { image?: string | null }[] | null;
}) => [project.image, ...(project.images || []).map((shot) => shot.image)];

export const findProjectUploads = async (id: string) => {
	const project = await prisma.project.findUnique({
		where: { id },
		select: { image: true, images: { select: { image: true } } },
	});

	return project ? projectUploads(project) : [];
};

export const projectStackIds = (body: IFormDataProject) =>
	(body.stack || []).map((skill) => ({ id: skill.id }));

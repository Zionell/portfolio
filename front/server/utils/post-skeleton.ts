import type {
	PostSkeleton,
	Prisma,
	Project,
} from "~~/generated/prisma/client";

export type SkeletonWithProject = PostSkeleton & {
	project: Pick<Project, "name" | "description_ru" | "description_en"> | null;
};

export const SKELETON_PROJECT_SELECT = {
	name: true,
	description_ru: true,
	description_en: true,
} as const;

// Скелетон из PR узнаём по коммитам или репозиторию, а не по проекту:
// тему тоже можно привязать к проекту, но писать её надо как статью
export const isPrSkeleton = (skeleton: PostSkeleton): boolean =>
	Boolean(skeleton.commits?.trim() || skeleton.repo_name?.trim());

export const skeletonDraftInput = (
	skeleton: SkeletonWithProject,
): IPostDraftInput => {
	const { project } = skeleton;

	return {
		title: skeleton.title,
		excerpt: skeleton.body,
		lang: skeleton.lang,
		pr: isPrSkeleton(skeleton)
			? {
					repoName: skeleton.repo_name,
					projectName: project?.name || null,
					projectDescription:
						(skeleton.lang === "en"
							? project?.description_en
							: project?.description_ru) ||
						project?.description_ru ||
						project?.description_en ||
						null,
					commits: skeleton.commits || "",
				}
			: null,
	};
};

// Внешний сборщик PR знает только имя репозитория — ищем проект по slug
export const resolveProjectId = async (
	projectId?: string | null,
	repoName?: string | null,
): Promise<string | null> => {
	if (projectId) {
		const project = await prisma.project.findUnique({
			where: { id: projectId },
			select: { id: true },
		});

		if (!project) {
			throw createError({
				statusCode: 400,
				statusMessage: "Project not found",
			});
		}

		return project.id;
	}

	if (!repoName?.trim()) return null;

	const project = await prisma.project.findFirst({
		where: { slug: { equals: repoName.trim(), mode: "insensitive" } },
		select: { id: true },
	});

	return project?.id || null;
};

// тег проекта у поста на сайте: ссылка ведёт на страницу проекта,
// только если она включена (showDetail)
export const PUBLIC_POST_PROJECT_SELECT = {
	name: true,
	slug: true,
	showDetail: true,
} as const;

// Новые посты сверху: date — дата публикации в формате YYYY-MM-DD,
// поэтому строковая сортировка совпадает с хронологической
export const PUBLIC_POSTS_ORDER = [
	{ date: "desc" },
	{ createdAt: "desc" },
] as const satisfies Prisma.PostsOrderByWithRelationInput[];

// проект в админке: селекты и таблица скелетонов
export const POST_PROJECT_SELECT = {
	id: true,
	name: true,
	slug: true,
} as const;

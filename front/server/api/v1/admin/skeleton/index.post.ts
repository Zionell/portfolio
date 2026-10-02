import type { IFormDataSkeleton } from "#shared/types/blog.types";

const LANGS = ["ru", "en"];

// Создаёт скелетон из админки (тема) или от сборщика PR по токену
export default defineEventHandler(async (event) => {
	const body = await readBody<IFormDataSkeleton>(event);
	const title = body?.title?.trim();
	const text = body?.body?.trim() || "";
	const commits = body?.commits?.trim() || null;
	const repoName = body?.repo_name?.trim() || null;

	if (!title) {
		throw createError({
			statusCode: 400,
			statusMessage: "Title is required",
		});
	}

	// у темы текст — это excerpt будущего поста, без него писать не о чем;
	// у PR описание бывает пустым, хватает коммитов
	if (!text && !commits) {
		throw createError({
			statusCode: 400,
			statusMessage: "Text or commits are required",
		});
	}

	return prisma.postSkeleton.create({
		data: {
			title,
			body: text,
			lang: LANGS.includes(body.lang) ? body.lang : "ru",
			commits,
			repo_name: repoName,
			projectId: await resolveProjectId(body.projectId, repoName),
		},
	});
});

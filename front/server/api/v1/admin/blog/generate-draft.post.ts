import type {
	IGenerateDraftBody,
	IGeneratedDraft,
} from "#shared/types/blog.types";

// Текст и обложка по заголовку и excerpt из формы, а для скелетона из PR —
// по его коммитам. В БД ничего не пишет: результат подставляется в форму,
// сохраняет пост сам админ
export default defineEventHandler(async (event): Promise<IGeneratedDraft> => {
	const body = await readBody<Partial<IGenerateDraftBody>>(event);
	const title = body?.title?.trim();
	const excerpt = body?.excerpt?.trim();

	const skeleton = body?.skeletonId
		? await prisma.postSkeleton.findUnique({
				where: { id: body.skeletonId },
				include: { project: { select: SKELETON_PROJECT_SELECT } },
			})
		: null;

	const isPr = Boolean(skeleton && isPrSkeleton(skeleton));

	if (!isPr && (!title || !excerpt)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Title and excerpt are required",
		});
	}

	try {
		const draft = await fetchPostDraft(
			skeleton && isPr
				? skeletonDraftInput(skeleton)
				: {
						title: title!,
						excerpt: excerpt!,
						lang: body?.lang || "en",
					},
		);

		return {
			title: draft.title,
			excerpt: draft.excerpt,
			content: draft.content,
			readTime: draft.readTime,
			cover: await savePostCover(draft.imageBase64),
		};
	} catch (error) {
		console.error("[post-draft] генерация не удалась", error);

		throw createError({
			statusCode: 502,
			statusMessage: "Failed to generate post",
		});
	}
});

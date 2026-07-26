import type { IFormDataPostContent } from "#shared/types/blog.types";

interface IPostContentCreate {
	text: string | null;
	image: string | null;
	video: string | null;
	order: number;
}

export function todayDateString(): string {
	const now = new Date();
	const month = `${now.getMonth() + 1}`.padStart(2, "0");
	const day = `${now.getDate()}`.padStart(2, "0");

	return `${now.getFullYear()}-${month}-${day}`;
}

const isEmptyHtml = (value: string): boolean => {
	return !value
		.replace(/<[^>]*>/g, "")
		.replace(/&nbsp;/g, " ")
		.trim();
};

/**
 * Приводит блоки из формы админки к виду, который ждёт prisma:
 * чистит html, выкидывает пустые блоки и перенумеровывает order.
 */
export function normalizePostContent(
	blocks?: IFormDataPostContent[],
): IPostContentCreate[] {
	if (!blocks?.length) return [];

	return blocks
		.map((block) => {
			const text = sanitizePostHtml(block.text);

			return {
				text: text && !isEmptyHtml(text) ? text : null,
				image: block.image?.trim() || null,
				video: block.video?.trim() || null,
			};
		})
		.filter((block) => block.text || block.image || block.video)
		.map((block, index) => ({ ...block, order: index }));
}

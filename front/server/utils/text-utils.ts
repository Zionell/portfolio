import { filterXSS, type IFilterXSSOptions } from "xss";

// Разметка, которую отдаёт Quill-редактор из админки.
// Контент выводится через v-html, поэтому чистим его на сохранении.
const postHtmlOptions: IFilterXSSOptions = {
	whiteList: {
		p: ["class", "style"],
		br: [],
		span: ["class", "style"],
		strong: [],
		b: [],
		em: [],
		i: [],
		u: [],
		s: [],
		sub: [],
		sup: [],
		h1: ["class"],
		h2: ["class"],
		h3: ["class"],
		h4: ["class"],
		h5: ["class"],
		h6: ["class"],
		ul: ["class"],
		ol: ["class"],
		li: ["class", "data-list"],
		blockquote: ["class"],
		pre: ["class", "spellcheck"],
		code: ["class"],
		// Quill рендерит code-block контейнером из div'ов
		div: ["class", "spellcheck", "data-language"],
		hr: [],
		a: ["href", "target", "rel", "title"],
		img: ["src", "alt", "title", "width", "height"],
		iframe: ["src", "width", "height", "allowfullscreen", "frameborder"],
	},
	stripIgnoreTag: true,
	stripIgnoreTagBody: ["script", "style"],
};

export function sanitizePostHtml(input?: string | null): string {
	if (!input) return "";

	return filterXSS(input, postHtmlOptions).trim();
}

export function cleanHtmlText(input: string): string {
	if (!input) return "";

	return (
		input
			// декодируем двойные сущности (&amp;nbsp; -> &nbsp;)
			.replace(/&amp;/g, "&")
			// заменяем nbsp на обычный пробел
			.replace(/&nbsp;/g, " ")
			// апострофы
			.replace(/&rsquo;/g, `'`)
			// убираем лишние пробелы
			.replace(/\s+/g, " ")
			.trim()
	);
}

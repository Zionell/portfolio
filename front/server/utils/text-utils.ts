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
	// встраивать можно только видео-плееры: черновики пишет LLM по тексту
	// PR, и чужой iframe в посте — готовая фишинговая форма на нашем домене
	onTagAttr: (tag, name, value) => {
		if (tag === "iframe" && name === "src" && !isAllowedEmbed(value)) {
			return "";
		}
	},
};

const EMBED_HOSTS = [
	"www.youtube.com",
	"www.youtube-nocookie.com",
	"player.vimeo.com",
];

const isAllowedEmbed = (src: string): boolean => {
	try {
		const url = new URL(src);

		return url.protocol === "https:" && EMBED_HOSTS.includes(url.hostname);
	} catch {
		return false;
	}
};

export function sanitizePostHtml(input?: string | null): string {
	if (!input) return "";

	return filterXSS(input, postHtmlOptions).trim();
}

// SVG-иконки навыков вставляются через v-html: оставляем только разметку
// отрисовки — без script, foreignObject, обработчиков и внешних ссылок
const SVG_ATTRS = [
	"id", "class", "d", "fill", "fill-opacity", "fill-rule", "clip-rule",
	"clip-path", "mask", "filter", "opacity", "stroke", "stroke-width",
	"stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity",
	"stroke-dasharray", "transform", "x", "y", "x1", "x2", "y1", "y2", "cx",
	"cy", "r", "rx", "ry", "dx", "dy", "width", "height", "points", "offset",
	"stop-color", "stop-opacity", "gradientUnits", "gradientTransform",
	"filterUnits", "in", "in2", "k1", "k2", "k3", "k4", "operator", "result",
	"stdDeviation", "type", "values", "viewBox", "preserveAspectRatio",
	"xmlns", "xmlns:xlink", "version",
];

const SVG_TAGS = [
	"svg", "g", "path", "circle", "ellipse", "rect", "line", "polyline",
	"polygon", "defs", "clipPath", "mask", "linearGradient", "radialGradient",
	"stop", "filter", "feColorMatrix", "feComposite", "feGaussianBlur",
	"feOffset", "feBlend", "feFlood", "feMerge", "feMergeNode", "title",
];

const svgOptions: IFilterXSSOptions = {
	whiteList: Object.fromEntries(SVG_TAGS.map((tag) => [tag, SVG_ATTRS])),
	stripIgnoreTag: true,
	stripIgnoreTagBody: ["script", "style", "foreignObject"],
	// стандартная проверка рассчитана на HTML-атрибуты; ссылок (href,
	// xlink:href) в списке нет, поэтому режем только скриптовые схемы
	safeAttrValue: (tag, name, value) =>
		/^\s*(javascript|data):/i.test(value) ? "" : value.replace(/"/g, "&quot;"),
};

export function sanitizeSvg(input?: string | null): string {
	if (!input) return "";

	return filterXSS(input, svgOptions).trim();
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

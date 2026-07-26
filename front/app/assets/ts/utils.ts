import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export const resolveFile = (payload: any): File | null => {
	const files = payload?.files || payload?.target?.files;
	if (!files) return null;
	return Array.isArray(files) ? files[0] : files?.[0] || null;
};

const translit: Record<string, string> = {
	а: "a",
	б: "b",
	в: "v",
	г: "g",
	д: "d",
	е: "e",
	ё: "e",
	ж: "zh",
	з: "z",
	и: "i",
	й: "i",
	к: "k",
	л: "l",
	м: "m",
	н: "n",
	о: "o",
	п: "p",
	р: "r",
	с: "s",
	т: "t",
	у: "u",
	ф: "f",
	х: "h",
	ц: "c",
	ч: "ch",
	ш: "sh",
	щ: "sch",
	ъ: "",
	ы: "y",
	ь: "",
	э: "e",
	ю: "yu",
	я: "ya",
};

export const slugify = (value: string): string => {
	return value
		.toLowerCase()
		.split("")
		.map((char) => translit[char] ?? char)
		.join("")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
};

export const formatDate = (date: Date, locale: "en" | "ru"): string => {
	return new Date(date).toLocaleDateString(locale, {
		year: "numeric",
		month: "long",
	});
};

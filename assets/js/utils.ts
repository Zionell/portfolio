import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export function scrollToBlock(
	id: string,
	offset = 0,
	force = false,
	parentDocument: null | Document = null,
): void {
	const doc = parentDocument || document;
	const target = doc.getElementById(id || "__nuxt");

	if (target) {
		const position =
			target.getBoundingClientRect().top + window.pageYOffset;

		if (force) {
			window.scroll({
				top: position - offset,
				left: 0,
				behavior: "instant",
			});
		} else {
			gsap.to(window, {
				duration: 0.5,
				scrollTo: { y: position, offsetY: offset },
			});
		}
	}
}

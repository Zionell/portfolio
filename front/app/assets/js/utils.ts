import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export function scrollToBlock(id: string, offset = 0): void {
	const target = document.getElementById(id || "__nuxt");

	if (target) {
		const position =
			target.getBoundingClientRect().top + window.pageYOffset;

		gsap.to(window, {
			duration: 0.3,
			scrollTo: { y: position, offsetY: offset },
		});
	}
}

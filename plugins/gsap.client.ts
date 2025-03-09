import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default defineNuxtPlugin(() => {
	gsap.registerPlugin(ScrollTrigger);
	gsap.registerPlugin(TextPlugin);

	return {
		provide: {
			gsap,
		},
	};
});

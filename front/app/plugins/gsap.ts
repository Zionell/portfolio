import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export default defineNuxtPlugin(() => {
	gsap.registerPlugin(ScrollTrigger);
	gsap.registerPlugin(SplitText);

	return {
		provide: {
			gsap,
			splitText: SplitText,
		},
	};
});

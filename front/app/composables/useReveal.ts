import type { ComponentPublicInstance } from "vue";

type RevealItem = HTMLElement | ComponentPublicInstance | null | undefined;
type RevealTarget = RevealItem | RevealItem[];

/**
 * Nocturne scroll-reveal: fade-in from 26px below when the element enters
 * the viewport, replayed in both scroll directions (design: [data-reveal]).
 */
export function useReveal(getEls: () => RevealTarget[]) {
	const { $gsap } = useNuxtApp();

	onMounted(() => {
		nextTick(() => {
			const els = getEls()
				.flatMap((e) => (e ? (Array.isArray(e) ? e : [e]) : []))
				.map((e) =>
					e instanceof HTMLElement
						? e
						: ((e as ComponentPublicInstance)?.$el as HTMLElement),
				)
				.filter((e): e is HTMLElement => e instanceof HTMLElement);

			els.forEach((el, i) => {
				$gsap.from(el, {
					y: 26,
					autoAlpha: 0,
					duration: 0.7,
					ease: "power3.out",
					delay: (i % 4) * 0.06,
					scrollTrigger: {
						trigger: el,
						start: "top 90%",
						toggleActions: "play none play reverse",
					},
				});
			});
		});
	});
}

<script setup lang="ts">
import type { IAbout } from "#shared/types/home.types";
import { initImageShape } from "~/assets/ts/imageShape";

const props = defineProps<{
	content: IAbout;
}>();

const { $gsap, $splitText } = useNuxtApp();
const wrapperRef = useTemplateRef("wrapperRef");
const textRef = useTemplateRef("textRef");

const animate = () => {
	$splitText.create(textRef.value, {
		type: "chars",
		onSplit: (self) => {
			$gsap.from(self.chars, {
				scrollTrigger: {
					trigger: textRef.value,
					start: "top 60%",
					end: "top 90%",
					toggleActions: "play none resume reverse",
				},
				y: 100,
				autoAlpha: 0,
				stagger: {
					from: "random",
					amount: 0.5,
				},
			});
		},
	});
};

onMounted(() => {
	nextTick(() => {
		animate();

		if (wrapperRef.value) {
			initImageShape(wrapperRef.value);
		}
	});
});
</script>

<template>
	<TheSectionWrapper :class="$style.section" :title="$t('sections.about')">
		<div ref="wrapperRef" :class="$style.HomeAbout">
			<canvas></canvas>

			<div :class="$style.content">
				<div v-if="props.content?.text?.length" :class="$style.text">
					<div
						v-for="(text, ind) in props.content.text"
						:key="ind"
						ref="textRef"
						:class="$style.paragraph"
						v-html="text.text"
					/>
				</div>

				<NuxtImg
					v-if="props.content.image"
					:class="$style.photo"
					:src="props.content.image"
					alt="Portfolio picture"
					placeholder
					data-webgl-media
				/>
			</div>
		</div>
	</TheSectionWrapper>
</template>

<style lang="scss" module>
.section {
	position: relative;
}

.HomeAbout {
	canvas {
		position: fixed;
		inset: 0;
		z-index: 100;
		width: 100%;
		height: 100%;
		opacity: 1;
		pointer-events: none;
	}
}

.content {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 48rem);
	gap: 4rem;
	align-items: center;

	@include media($tablet) {
		grid-template-columns: 1fr;
	}
}

.text {
	display: grid;
	gap: 2rem;
	max-width: 78rem;
}

[data-webgl-media] {
	opacity: 0;
}

.paragraph {
	font-size: 1.8rem;
	line-height: 1.7;
	color: $gray5;

	@include media($mobile) {
		font-size: 1.6rem;
	}
}

.photo {
	width: 100%;
	height: 60vh;
	//border-radius: 2.4rem;
	//object-fit: cover;
	//filter: contrast(1.05) saturate(1.05);
}
</style>

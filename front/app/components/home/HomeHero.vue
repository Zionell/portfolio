<script setup lang="ts">
import type { HomeHero } from "~~/generated/prisma/client";
import FluidBg from "~/components/common/FluidBg.vue";

const props = defineProps<{
	content: HomeHero;
}>();

const { $gsap, $splitText } = useNuxtApp();
const titleRef = useTemplateRef("titleRef");
const textRef = useTemplateRef("textRef");

const animate = () => {
	$splitText.create(titleRef.value, {
		type: "chars",
		onSplit: (self) => {
			$gsap.from(self.chars, {
				rotateX: 360,
				autoAlpha: 0,
				stagger: {
					from: "random",
					amount: 0.5,
				},
			});
		},
	});
	$splitText.create(textRef.value, {
		type: "chars",
		onSplit: (self) => {
			$gsap.from(self.chars, {
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

const { whenReady } = usePreloader();

onMounted(() => {
	whenReady(() => nextTick(animate));
});
</script>

<template>
	<section :class="$style.HomeHero">
		<div :class="$style.bg">
			<FluidBg
				:colors="['#4d4640', '#3f4542', '#7f8383']"
				:count="3"
				:speed="0.2"
				:amplitude="0.9"
				:waviness="1.7"
				:thickness="0.7"
				:glow="0.75"
				:taper="1.5"
				:spread="1.1"
				:intensity="0.2"
				:saturation="1.7"
				:opacity="1"
				:scale="2.8"
				:glass="false"
				:refraction="1"
				:dispersion="0.85"
				:glass-size="1"
			/>
		</div>

		<div :class="[$style.content, 'container']">
			<h1
				v-if="props.content.title"
				ref="titleRef"
				:class="$style.title"
				v-html="props.content.title"
			/>
			<div
				v-if="props.content.subtitle"
				ref="textRef"
				:class="$style.subtitle"
				v-html="props.content.subtitle"
			/>
		</div>
	</section>
</template>

<style lang="scss" module>
.HomeHero {
	min-height: 100vh;
	color: $white;
	background: #000;
	display: flex;
	position: relative;
	overflow: hidden;
}

.bg {
	position: absolute;
	inset: 0;
	z-index: 0;
}

.content {
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 2;
	padding: 4rem 6rem 6rem;
	flex: 1;
	justify-content: center;

	@include media($mobile) {
		padding: 4rem 2rem;
	}
}

.title {
	font-family: $ff-title;
	font-size: 7.2rem;
	line-height: 1.1;
	text-transform: uppercase;
	color: $white;

	@include media($mobile) {
		font-size: 5.2rem;
	}
}

.subtitle {
	font-size: 2rem;
	line-height: 1.6;
	color: $gray6;
}
</style>

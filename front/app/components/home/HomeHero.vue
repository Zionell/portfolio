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

onMounted(() => {
	nextTick(animate);
});
</script>

<template>
	<section :class="$style.HomeHero">
		<FluidBg />

		<div :class="$style.content">
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

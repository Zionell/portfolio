<script setup lang="ts">
import type { HomeHero } from "~~/generated/prisma/client";

const props = defineProps<{
	content: HomeHero;
}>();
</script>

<template>
	<section :class="$style.HomeHero">
		<div :class="$style.content">
			<h1
				v-if="props.content.title"
				:class="$style.title"
				v-html="props.content.title"
			/>
			<div
				v-if="props.content.subtitle"
				:class="$style.subtitle"
				v-html="props.content.subtitle"
			/>
		</div>
		<div :class="$style.background">
			<NuxtImg src="/images/hero.png" fit="cover" preload />
		</div>
	</section>
</template>

<style lang="scss" module>
.HomeHero {
	min-height: 100vh;
	padding: 4rem 6rem 6rem;
	color: $white;
	background: #000;
	display: flex;
	position: relative;
	overflow: hidden;
}

.background {
	position: absolute;
	inset: 0;
	z-index: 0;

	&:after {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(0, 0, 0, 0.35),
			rgba(0, 0, 0, 0.6) 80%
		);
		z-index: 1;
	}
}

.content {
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 2;
	flex: 1;
	justify-content: center;
}

.title {
	font-family: $ff-title;
	font-size: 7.2rem;
	line-height: 1.1;
	text-transform: uppercase;
	color: $white;
}

.subtitle {
	font-size: 1.8rem;
	line-height: 1.6;
	color: $gray5;
}
</style>

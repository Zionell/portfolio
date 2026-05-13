<script setup lang="ts">
import type { IHomeProject } from "#shared/types/home.types";
import { initImageShape } from "~/assets/ts/imageShape";

const props = defineProps<{
	content: IHomeProject[];
}>();

const wrapperRef = useTemplateRef("wrapperRef");

onMounted(async () => {
	await nextTick(() => {
		if (wrapperRef.value) {
			initImageShape(wrapperRef.value);
		}
	});
});
</script>

<template>
	<TheSectionWrapper :title="$t('sections.projects')">
		<div ref="wrapperRef" :class="$style.HomeProjects">
			<canvas></canvas>
			<div :class="$style.container">
				<div v-for="project in props.content" :class="$style.card">
					<img
						v-if="project?.image"
						:class="$style.cardImg"
						:src="project.image"
						alt="image of ceramic piece"
						data-webgl-media
					/>
					<div><strong>X05</strong><span>Kenji Sato</span></div>
				</div>
			</div>
		</div>
	</TheSectionWrapper>
</template>

<style lang="scss" module>
.HomeProjects {
	position: relative;

	canvas {
		position: fixed;
		inset: 0;
		z-index: 100;
		width: 100%;
		height: 100%;
		opacity: 1;
		pointer-events: none;
	}

	[data-webgl-media] {
		opacity: 0;
	}
}

.container {
	display: grid;
}

.card {
	position: relative;
	overflow: hidden;
	border-radius: 1.2rem;
	transition: $default-transition;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 6rem;
	height: 60vh;
}

.cardImg {
	position: relative;
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: $default-transition;
	z-index: 0;
}

.cardBody {
	position: absolute;
	inset: 0;
	padding: 1.6rem;
	z-index: 3;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.cardTitle {
	font-size: 1.4rem;
	color: $white;
}

.cardMeta {
	font-size: 1rem;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: rgba(255, 255, 255, 0.6);
}

.stackList {
	padding-top: 1.2rem;
	display: flex;
	flex-wrap: wrap;
	gap: 0.8rem;
	height: 0;
	transform: translateY(100%);
	transform-origin: bottom;
}

.stack {
	font-size: 1.3rem;
	color: $gray4;
	display: flex;
	align-items: center;
	gap: 0.8rem;

	&:not(:last-child):after {
		content: "•";
	}
}
</style>

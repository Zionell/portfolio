<script setup lang="ts">
import type { IHomeProject } from "#shared/types/home.types";
import { initImageShape } from "~/assets/ts/imageShape";
import ProjectCard from "~/components/projects/ProjectCard.vue";

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
				<ProjectCard
					v-for="(project, ind) in props.content"
					:key="project.id"
					:reverse="ind % 2 === 0"
					:project="project"
				/>
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
	gap: 6rem;
}
</style>

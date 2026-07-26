<script setup lang="ts">
import type { IHomeProject } from "#shared/types/home.types";
import ProjectCard from "~/components/projects/ProjectCard.vue";

const props = defineProps<{
	content: IHomeProject[];
}>();
</script>

<template>
	<TheSectionWrapper class="container" :title="$t('sections.projects')">
		<div :class="$style.HomeProjects">
			<ProjectCard
				v-for="project in props.content"
				:key="project.id"
				:project="project"
			/>
		</div>
	</TheSectionWrapper>
</template>

<style lang="scss" module>
.HomeProjects {
	position: relative;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 3.2rem;

	@include media($tablet) {
		grid-template-columns: repeat(2, 1fr);
	}

	@include media($mobile) {
		grid-template-columns: 1fr;
	}
}
</style>

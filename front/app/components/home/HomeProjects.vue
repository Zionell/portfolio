<script setup lang="ts">
import ProjectCard from "~/components/projects/ProjectCard.vue";

const props = defineProps<{
	content: IProjectCard[];
}>();
</script>

<template>
	<TheSectionWrapper class="container" :title="$t('sections.projects')">
		<template #header>
			<NuxtLink :class="$style.more" to="/projects">
				{{ $t("common.viewAll") }}
			</NuxtLink>
		</template>

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
.more {
	font-size: 1.2rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	text-decoration: none;
	white-space: nowrap;

	@include link-sweep($gray4, $accent);
}

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

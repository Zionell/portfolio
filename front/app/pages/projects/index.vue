<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { IProjectCard } from "#shared/types/project.types";
import ProjectCard from "~/components/projects/ProjectCard.vue";

const { t } = useI18n();

const { data: projects } = await useFetch<IProjectCard[]>(api.projects);

useSeoMeta({
	title: () => t("project.pageTitle"),
	description: () => t("project.pageSubtitle"),
});

const sorted = computed(() => {
	const list = projects.value ?? [];

	return [...list].sort(
		(a, b) => Number(a.isArchived) - Number(b.isArchived),
	);
});
</script>

<template>
	<main :class="[$style.ProjectsPage, 'container']">
		<section :class="$style.hero">
			<p :class="$style.kicker">{{ $t("sections.projects") }}</p>

			<h1 :class="$style.title">{{ $t("project.pageTitle") }}</h1>

			<p :class="$style.subtitle">{{ $t("project.pageSubtitle") }}</p>
		</section>

		<div v-if="sorted.length" :class="$style.grid">
			<ProjectCard
				v-for="project in sorted"
				:key="project.id"
				:project="project"
			/>
		</div>

		<div v-else :class="$style.empty">
			{{ $t("project.empty") }}
		</div>
	</main>
</template>

<style lang="scss" module>
.ProjectsPage {
	padding: 14rem 6rem 10rem;
	display: flex;
	flex-direction: column;
	gap: 3.2rem;

	@include media($mobile) {
		padding: 8rem 2rem 6rem;
		gap: 2.4rem;
	}
}

.hero {
	display: grid;
	gap: 2rem;
	justify-items: start;
}

.kicker {
	display: flex;
	align-items: center;
	gap: 1.2rem;
	font-size: 1.2rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: $gray4;

	&:before {
		content: "";
		width: 4.4rem;
		height: 1px;
		background: $gray3;
	}
}

.title {
	font-family: $ff-title;
	color: $white;
	font-size: 4.2rem;
	line-height: 1.08;
	text-transform: uppercase;

	@include media($mobile) {
		font-size: 3.2rem;
	}
}

.subtitle {
	font-size: 1.6rem;
	line-height: 1.7;
	color: $gray5;
	max-width: 70ch;

	@include media($mobile) {
		font-size: 1.4rem;
	}
}

.grid {
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

.empty {
	padding: 4rem 0;
	font-size: 1.5rem;
	color: $gray4;
}
</style>

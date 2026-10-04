<script setup lang="ts">
import type { IProjectDetail } from "#shared/types/project.types";
import ProjectDossier from "~/components/projects/detail/ProjectDossier.vue";
import { api } from "~/assets/data/api.ts";

const route = useRoute();

const slug = computed(() => String(route.params.slug || ""));

const { data: project, error } = await useFetch<IProjectDetail>(
	() => `${api.projects}/${slug.value}`,
);

if (error.value || !project.value) {
	throw showError({
		status: 404,
		statusText: "Page Not Found",
	});
}

useSeoMeta({
	title: () => project.value?.name,
	description: () => project.value?.description,
	ogTitle: () => project.value?.name,
	ogDescription: () => project.value?.description,
	ogImage: () => project.value?.image || undefined,
});
</script>

<template>
	<ProjectDossier v-if="project" :project="project" />
</template>

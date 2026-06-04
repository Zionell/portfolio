<script setup lang="ts">
import type { IHomeData } from "#shared/types/home.types";
import { api } from "~/assets/data/api";

const { data } = await useFetch<IHomeData>(api.home);
</script>

<template>
	<main :class="$style.page">
		<HomeHero v-if="data?.hero" :content="data.hero" />
		<HomeAbout v-if="data?.about" :content="data.about" id="about" />
		<HomeExperience
			v-if="data?.experience.length"
			:content="data.experience"
			id="experience"
		/>
		<HomeSkills
			v-if="data?.skills.length"
			:content="data.skills"
			id="skills"
		/>
		<HomeProjects
			v-if="data?.projects.length"
			:content="data.projects"
			id="projects"
		/>
		<HomeBlog v-if="data?.blog.length" :content="data.blog" />
	</main>
</template>

<style lang="scss" module>
.page {
	min-height: 100vh;
}
</style>

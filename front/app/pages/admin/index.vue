<script setup lang="ts">
import type { ITab } from "#shared/types/admin.types";

definePageMeta({
	layout: "admin",
});

const tabs: ITab[] = [
	{ id: "hero", label: "Hero" },
	{ id: "about", label: "About" },
	{ id: "experience", label: "Experience" },
	{ id: "skills", label: "Skills" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const activeTab = ref<TabId>(tabs?.[0]?.id || '');
</script>

<template>
	<section :class="$style.AdminSection">
		<AdminHeader
			:tabs="tabs"
			:active-tab="activeTab"
			@change-tab="activeTab = $event"
		/>

		<AdminHero v-if="activeTab === 'hero'" />
		<AdminAbout v-if="activeTab === 'about'" />
		<AdminSkills v-if="activeTab === 'skills'" />
		<AdminExperience v-if="activeTab === 'experience'" />
	</section>
</template>

<style lang="scss" module>
.AdminSection {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
</style>

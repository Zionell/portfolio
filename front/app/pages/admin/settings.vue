<script setup lang="ts">
import type { ITab } from "#shared/types/admin.types";

definePageMeta({
	layout: "admin",
});

const tabs: ITab[] = [
	{ id: "contacts", label: "Contacts" },
	{ id: "seo", label: "Seo" },
	{ id: "meta", label: "Meta" },
	{ id: "links", label: "Links" },
	{ id: "scripts", label: "Scripts" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const activeTab = ref<TabId>(tabs?.[0]?.id || "");
</script>

<template>
	<section :class="$style.AdminSection">
		<AdminHeader
			title="Settings"
			description="Contacts, SEO, Meta, Links and Scripts."
			:tabs="tabs"
			:active-tab="activeTab"
			@change-tab="activeTab = $event"
		/>

		<AdminContacts v-if="activeTab === 'contacts'" />
		<AdminSeo v-if="activeTab === 'seo'" />
		<AdminScripts v-if="activeTab === 'scripts'" />
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

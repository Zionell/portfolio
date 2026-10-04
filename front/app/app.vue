<script setup lang="ts">
import ThePreloader from "~/components/common/ThePreloader.vue";

const layout = useLayout();
</script>

<template>
	<ThePreloader v-if="layout === 'default'" />

	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

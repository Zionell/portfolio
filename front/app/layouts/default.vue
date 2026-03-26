<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { ISettings } from "#shared/types/settings.types";
import TheHeader from "~/components/common/TheHeader.vue";

const head = useLocaleHead();

const { data: settings } = await useFetch<ISettings>(api.settings);

useHead({
	htmlAttrs: head.value.htmlAttrs,
	meta: [
		{
			charset: "utf-8",
		},
		{
			name: "viewport",
			content:
				"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
		},
		...(settings.value?.meta || []),
	],
	link: settings.value?.links || [],
	script: settings.value?.scripts || [],
	noscript: settings.value?.noScripts || [],
});

useSeoMeta({
	title: settings.value?.seo?.title,
	ogTitle: settings.value?.seo?.title,
	twitterTitle: settings.value?.seo?.title,
	description: settings.value?.seo?.description,
	ogDescription: settings.value?.seo?.description,
	twitterDescription: settings.value?.seo?.description,
	ogImage: settings.value?.seo?.image,
	twitterImage: settings.value?.seo?.image,
	ogUrl: settings.value?.seo?.link,
	twitterCard: "summary_large_image",
});
</script>

<template>
	<div :class="$style.layout">
		<TheHeader :settings="settings" />

		<slot />

		<TheFooter :settings="settings" />
	</div>
</template>

<style lang="scss" module>
.layout {
	min-height: 100vh;
}
</style>

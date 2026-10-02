<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { ISettings } from "#shared/types/settings.types";
import TheHeader from "~/components/common/TheHeader.vue";
import type {
	SettingsSeo,
	SettingsSeoContent,
} from "~~/generated/prisma/client";
import { faviconsLinks, faviconsMeta } from "~/assets/data/favicons";

type TSettingResponse = SettingsSeo &
	SettingsSeoContent & {
		content: SettingsSeoContent[];
	};

const head = useLocaleHead();

const seo = ref<TSettingResponse | null>(null);

const { data } = await useFetch<ISettings>(api.settings);

// без JS Метрика считает заход пикселем; сам счётчик грузит плагин.
// В dev, как и плагин, не подключаем
const metrikaId = Number(useRuntimeConfig().public.yandexMetrikaId);
const metrikaNoScript =
	metrikaId && !import.meta.dev
		? [
				{
					innerHTML: `<div><img src="https://mc.yandex.ru/watch/${metrikaId}" style="position:absolute;left:-9999px" alt="" /></div>`,
					tagPosition: "bodyClose" as const,
				},
			]
		: [];

if (data.value?.seo?.content?.length) {
	seo.value = {
		...data.value.seo,
		...data.value.seo.content[0],
	};
}

useHead({
	htmlAttrs: head.value.htmlAttrs,
	meta: [
		{
			charset: "utf-8",
		},
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1, user-scalable=yes",
		},
		...(data.value?.meta || []),

		// Favicons
		...faviconsMeta,
	],
	link: [
		// Favicons
		...(Array.isArray(faviconsLinks) ? faviconsLinks : []),
	],
	script: data.value?.scripts || [],
	noscript: [...(data.value?.noScripts || []), ...metrikaNoScript],
});

useSeoMeta({
	title: seo.value?.title || "",
	ogTitle: seo.value?.title || "",
	twitterTitle: seo.value?.title || "",
	description: seo.value?.description || "",
	ogDescription: seo.value?.description || "",
	twitterDescription: seo.value?.description || "",
	ogImage: seo.value?.image || "",
	twitterImage: seo.value?.image || "",
	ogUrl: seo.value?.link || "",
	ogType: "website",
	twitterCard: "summary_large_image",
});
</script>

<template>
	<div :class="$style.layout">
		<NuxtLoadingIndicator color="#6d6e71" />

		<TheHeader :settings="data" />

		<slot />

		<TheFooter :settings="data" />
	</div>
</template>

<style lang="scss" module>
.layout {
	min-height: 100vh;
}
</style>

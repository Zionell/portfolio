<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { HomeHero } from "~~/generated/prisma/client";
import AdminSectionFooter from "~/components/admin/common/AdminSectionFooter.vue";

const { locales } = useI18n();

const formData = reactive<Partial<HomeHero>[]>([]);
const isLoading = ref<boolean>(false);

locales.value.forEach((l) => {
	formData.push({
		lang: l.code,
		title: "",
		subtitle: "",
	});
});

const { data } = await useFetch<HomeHero[]>(api.admin.hero);

if (data.value?.length) {
	data.value.forEach((hero) => {
		formData.forEach((form: Partial<HomeHero>, ind: number) => {
			if (form.lang === hero.lang) {
				formData[ind] = {
					...form,
					...hero,
				};
			}
		});
	});
}

const handleSave = async () => {
	try {
		isLoading.value = true;

		await $fetch(api.admin.hero, {
			method: "POST",
			body: formData,
		});
	} catch (error) {
		console.error(error);
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<div :class="$style.AdminSection">
		<PrimePanel
			v-for="hero in formData"
			:key="hero.lang"
			:header="hero.lang"
			toggleable
		>
			<div :class="$style.form">
				<PrimeFloatLabel variant="on">
					<PrimeInputText id="on_title" v-model="hero.title" />
					<label for="on_title">Title</label>
				</PrimeFloatLabel>
				<PrimeFloatLabel variant="on">
					<PrimeInputText id="on_subTitle" v-model="hero.subtitle" />
					<label for="on_subTitle">Subtitle</label>
				</PrimeFloatLabel>
			</div>
		</PrimePanel>

		<AdminSectionFooter :is-saving="isLoading" @save="handleSave" />
	</div>
</template>

<style module lang="scss">
.AdminSection,
.form {
	display: grid;
	gap: 2.4rem;
	padding-top: 1.6rem;
}
</style>

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
		availabilityStatus: "",
		availabilityFacts: [],
	});
});

const { data } = await useFetch<HomeHero[]>(api.admin.hero);

data.value?.forEach((hero) => {
	const ind = formData.findIndex((form) => form.lang === hero.lang);

	if (ind !== -1) {
		formData[ind] = {
			...formData[ind],
			...hero,
			availabilityFacts: [...(hero.availabilityFacts || [])],
		};
	}
});

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
					<PrimeInputText
						:id="`title_${hero.lang}`"
						v-model="hero.title"
					/>
					<label :for="`title_${hero.lang}`">Title</label>
				</PrimeFloatLabel>
				<PrimeFloatLabel variant="on">
					<PrimeInputText
						:id="`subtitle_${hero.lang}`"
						v-model="hero.subtitle"
					/>
					<label :for="`subtitle_${hero.lang}`">Subtitle</label>
				</PrimeFloatLabel>

				<div :class="$style.subtitle">Availability</div>

				<PrimeFloatLabel variant="on">
					<PrimeInputText
						:id="`status_${hero.lang}`"
						v-model="hero.availabilityStatus"
					/>
					<label :for="`status_${hero.lang}`">Status</label>
				</PrimeFloatLabel>

				<div :class="$style.block">
					<div>Facts</div>
					<PrimeInputChips
						v-model="hero.availabilityFacts"
						separator=","
						:addOnBlur="true"
						placeholder="Enter and comma add a new fact"
					/>
				</div>
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

.subtitle {
	padding-top: 1.6rem;
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	font-size: 1.1rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: $gray4;
}

.block {
	display: grid;
	gap: 1.2rem;
}
</style>

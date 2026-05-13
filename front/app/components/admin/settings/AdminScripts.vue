<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { SettingsScripts } from "~~/generated/prisma/client";

const types = ref(["script", "noScripts"]);
const formData = ref<Partial<SettingsScripts>[]>([
	{
		innerHTML: "",
		body: false,
		async: false,
		type: types.value[0],
	},
]);
const isLoading = ref<boolean>(false);

const { data, refresh } = await useFetch<SettingsScripts[]>(
	api.admin.settings.scripts,
);

if (data.value?.length) {
	formData.value = data.value;
}

const handleSave = async () => {
	try {
		isLoading.value = true;

		await $fetch(api.admin.settings.scripts, {
			method: "POST",
			body: formData.value,
		});

		await refresh();

		if (data.value?.length) {
			formData.value = data.value;
		}
	} catch (error) {
		console.error(error);
	} finally {
		isLoading.value = false;
	}
};

const addNewItem = () => {
	formData.value.push({
		innerHTML: "",
		body: false,
		async: false,
		type: types.value[0],
	});
};
</script>

<template>
	<div :class="$style.AdminSection">
		<PrimePanel
			v-for="(item, ind) in formData"
			:key="ind"
			:header="`Script ${ind + 1}`"
			toggleable
		>
			<div :class="$style.form">
				<PrimeSelectButton v-model="item.type" :options="types" />

				<div :class="$style.row">
					<label for="switch_body`">Body: </label>
					<PrimeToggleSwitch
						v-model="item.body"
						inputId="switch_body"
					/>
				</div>

				<div :class="$style.row">
					<label for="switch_async`">Async: </label>
					<PrimeToggleSwitch
						v-model="item.async"
						inputId="switch_async"
					/>
				</div>

				<PrimeFloatLabel variant="on">
					<PrimeTextarea
						id="innerHtml"
						v-model="item.innerHTML"
						rows="10"
						cols="50"
						style="resize: none"
					/>
					<label for="innerHtml">Script</label>
				</PrimeFloatLabel>
			</div>
		</PrimePanel>

		<PrimeButton
			:class="$style.removeBtn"
			icon="pi pi-plus"
			label="Add new experience"
			@click="addNewItem"
		/>

		<AdminSectionFooter :is-saving="isLoading" @save="handleSave" />
	</div>
</template>

<style module lang="scss">
.AdminSection {
	display: grid;
	gap: 2.4rem;
	padding-top: 1.6rem;
}

.form {
	display: grid;
	gap: 2.4rem;
	padding-top: 1.6rem;
}

.row {
	display: flex;
	align-items: center;
	gap: 2rem;
}
</style>

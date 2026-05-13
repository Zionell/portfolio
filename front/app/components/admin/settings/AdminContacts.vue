<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { SettingsContacts } from "~~/generated/prisma/client";

const formData = ref<Partial<SettingsContacts>[]>([
	{
		name: "",
		link: "",
	},
]);
const isLoading = ref<boolean>(false);

const { data, refresh } = await useFetch<SettingsContacts[]>(
	api.admin.settings.contacts,
);

if (data.value?.length) {
	formData.value = data.value;
}

const handleSave = async () => {
	try {
		isLoading.value = true;

		await $fetch(api.admin.settings.contacts, {
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
		name: "",
		link: "",
	});
};
</script>

<template>
	<div :class="$style.AdminSection">
		<PrimePanel
			v-for="(item, ind) in formData"
			:key="ind"
			:header="item.name || `Contact ${ind + 1}`"
			toggleable
		>
			<div :class="$style.form">
				<PrimeFloatLabel variant="on">
					<PrimeInputText id="innerName" v-model="item.name" />
					<label for="innerName">Name</label>
				</PrimeFloatLabel>
				<PrimeFloatLabel variant="on">
					<PrimeInputText id="innerLink" v-model="item.link" />
					<label for="innerLink">Link</label>
				</PrimeFloatLabel>
			</div>
		</PrimePanel>

		<PrimeButton
			icon="pi pi-plus"
			label="Add new contact"
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

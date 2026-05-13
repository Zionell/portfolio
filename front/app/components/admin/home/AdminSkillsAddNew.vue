<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { HomeSkill } from "~~/generated/prisma/client";
import { resolveFile } from "~/assets/ts/utils";

const props = defineProps<{
	initialOrder: number;
}>();

const emit = defineEmits<{
	update: [];
}>();

const isOpened = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const formData = reactive<Partial<HomeSkill>>({
	icon: "",
	label: "",
	order: props.initialOrder || 0,
});

const handleSave = async () => {
	try {
		isLoading.value = true;

		await $fetch(api.admin.skills, {
			method: "POST",
			body: formData,
		});
	} catch (error) {
		console.error("handleSave", error);
	} finally {
		isOpened.value = false;
		emit("update");
	}
};

const onSkillIconChange = async (event: any) => {
	try {
		const file = resolveFile(event);
		if (!file) return;

		formData.icon = await file.text();
	} catch (error) {
		console.error("onSkillIconChange", error);
	}
};
</script>

<template>
	<PrimeButton label="Add skill" @click="isOpened = true" />

	<PrimeDialog
		v-model:visible="isOpened"
		modal
		header="Add new skill"
		:style="{ width: '25rem' }"
	>
		<div :class="$style.form">
			<PrimeInputNumber
				v-model="formData.order"
				inputId="horizontal-buttons"
				showButtons
				buttonLayout="horizontal"
				:step="1"
				fluid
			>
				<template #incrementbuttonicon>
					<span class="pi pi-plus" />
				</template>
				<template #decrementbuttonicon>
					<span class="pi pi-minus" />
				</template>
			</PrimeInputNumber>
			<PrimeFloatLabel variant="on">
				<PrimeInputText id="on_label" v-model="formData.label" />
				<label for="on_label">Label</label>
			</PrimeFloatLabel>
			<div :class="$style.iconLoading">
				<PrimeFileUpload
					mode="basic"
					customUpload
					auto
					chooseLabel="Загрузить SVG"
					accept="image/svg+xml"
					@uploader="onSkillIconChange($event)"
				/>
				<div
					v-if="formData.icon"
					:class="$style.preview"
					v-html="formData.icon"
				/>
			</div>
		</div>

		<div :class="$style.buttons">
			<PrimeButton
				type="button"
				label="Cancel"
				severity="secondary"
				@click="isOpened = false"
			/>
			<PrimeButton type="button" label="Save" @click="handleSave" />
		</div>
	</PrimeDialog>
</template>

<style module lang="scss">
.form {
	display: grid;
	gap: 2.4rem;
	padding-top: 1.6rem;
}

.iconLoading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
}

.preview {
	width: 4rem;
	height: 4rem;

	svg {
		width: 100%;
		height: 100%;
	}
}

.buttons {
	padding-top: 1.6rem;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1.6rem;
}
</style>

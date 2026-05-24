<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { HomeSkill } from "~~/generated/prisma/client";
import AdminSectionFooter from "~/components/admin/common/AdminSectionFooter.vue";
import type {
	IFormDataExp,
	IResponseExp,
	IExperience,
} from "#shared/types/experience.types";

const DEFAULT_EXP = {
	company_en: "",
	company_ru: "",
	position_en: "New position",
	position_ru: "New position",
	responsibilities_en: "",
	responsibilities_ru: "",
	startDate: new Date(),
	endDate: new Date(),
	stack: [],
	isPresent: false,
	order: 0,
};

const isLoading = ref<boolean>(false);
const formData = ref<IFormDataExp[]>([{ ...DEFAULT_EXP }]);
const skills = ref<HomeSkill[]>([]);

const toDate = (value?: Date | string | null) => {
	if (!value) return new Date();
	return value instanceof Date ? value : new Date(value);
};

const setFormData = () => {
	if (data.value?.experience.length) {
		formData.value = data.value.experience.map((item) => ({
			...item,
			startDate: toDate(item.startDate),
			endDate: toDate(item.endDate),
			stack: item.stack || [],
		}));
	}

	skills.value = data.value?.skills || [];
};

const { data, refresh } = await useAsyncData<IResponseExp>(
	"experience",
	async () => {
		const [experience, skills] = await Promise.all([
			$fetch<IExperience[]>(api.admin.experience),
			$fetch<HomeSkill[]>(api.admin.skills),
		]);

		return { experience, skills };
	},
);

if (data.value) {
	setFormData();
}

const handleSave = async () => {
	try {
		isLoading.value = true;

		await $fetch(api.admin.experience, {
			method: "POST",
			body: formData.value,
		});

		await refresh();
		setFormData();
	} catch (error) {
		console.error("handleSave", error);
	} finally {
		isLoading.value = false;
	}
};

const removeItem = async ({ index, id }: { index?: number; id?: string }) => {
	try {
		if (id) {
			await $fetch(`${api.admin.experience}/${id}`, {
				method: "DELETE",
			});
		} else if (index !== undefined) {
			formData.value.splice(index, 1);
		}

		await refresh();
		setFormData();
	} catch (error) {
		console.error(error);
	}
};

const handleChange = (item: IFormDataExp, index: number) => {
	if (!formData.value[index]) {
		return;
	}

	formData.value[index] = item;
};

const addNewItem = () => {
	formData.value.push({
		...DEFAULT_EXP,
		order: formData.value.length,
	});
};
</script>
<template>
	<div :class="$style.AdminSection">
		<AdminExperiencePanel
			v-for="(item, index) in formData"
			:key="item?.id || index"
			:item="item"
			:index="index"
			:skills="skills"
			@remove="removeItem"
			@change="handleChange($event, index)"
		/>

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
	gap: 2rem;
}

.block {
	display: grid;
	gap: 2rem;
}
</style>

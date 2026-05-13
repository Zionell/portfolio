<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { HomeSkill } from "~~/generated/prisma/client";
import AdminSkillsAddNew from "~/components/admin/home/AdminSkillsAddNew.vue";

const isRemoving = ref<string[]>([]);

const { data, refresh } = await useFetch<HomeSkill[]>(api.admin.skills);

const initialOrder = computed(() => data.value?.length || 0);

const removeSkill = async (item: HomeSkill) => {
	try {
		isRemoving.value.push(item.id);

		await $fetch(`${api.admin.skills}/${item.id}`, {
			method: "DELETE",
		});

		await refresh();
	} catch (error) {
		console.error(error);
	}
};
</script>

<template>
	<div :class="$style.AdminSection">
		<AdminSkillsAddNew :initialOrder="initialOrder" @update="refresh" />

		<PrimePanel
			v-for="item in data"
			:key="item.id"
			:header="item.label"
			toggleable
			collapsed
		>
			<template #icons>
				<PrimeButton
					:class="$style.removeBtn"
					:loading="isRemoving.includes(item.id)"
					icon="pi pi-trash"
					@click="removeSkill(item)"
				/>
			</template>
			<div :class="$style.body">
				<div :class="$style.label">{{ item.label }}</div>
				<div :class="$style.icon" v-html="item.icon" />
			</div>
		</PrimePanel>
	</div>
</template>

<style module lang="scss">
.AdminSection {
	display: grid;
	gap: 2.4rem;
	padding-top: 1.6rem;
}

.body {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.label {
}

.icon {
	width: 5rem;
	height: 5rem;

	svg {
		width: 100%;
		height: 100%;
	}
}
</style>

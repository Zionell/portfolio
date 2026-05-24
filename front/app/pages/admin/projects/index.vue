<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { IProject } from "#shared/types/project.types";

definePageMeta({
	layout: "admin",
});

const { data, refresh } = await useFetch<IProject[]>(api.admin.projects);

const handleDelete = async (id: string) => {
	try {
		await $fetch(`${api.admin.projects}/${id}`, {
			method: "DELETE",
		});

		await refresh();
	} catch (error) {
		console.error(error);
	}
};

const handleRedirect = (id: string) => {
	navigateTo(`/admin/projects/${id}`);
};

const handleAddNew = () => {
	navigateTo(`/admin/projects/new?order=${data.value?.length || 0}`);
};
</script>

<template>
	<section :class="$style.AdminSection">
		<AdminHeader title="Projects">
			<PrimeButton label="Add project" @click="handleAddNew" />
		</AdminHeader>

		<div :class="$style.list" v-if="data?.length">
			<PrimeCard
				v-for="project in data"
				:key="project.id"
				:class="$style.card"
			>
				<template #header>
					<NuxtImg
						:class="$style.image"
						:alt="project.name"
						:src="project.image || '/images/default.png'"
					/>
				</template>

				<template #title>{{ project.name }}</template>

				<template #footer>
					<div :class="$style.actions">
						<PrimeButton
							label="Delete"
							severity="secondary"
							variant="outlined"
							class="w-full"
							@click="handleDelete(project.id)"
						/>
						<PrimeButton
							label="Edit"
							@click="handleRedirect(project.id)"
						/>
					</div>
				</template>
			</PrimeCard>
		</div>
	</section>
</template>

<style lang="scss" module>
.AdminSection {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.list {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 2rem;
	padding: 2rem 0;
}

.card {
	justify-content: space-between;
}

.image {
	width: 100%;
	height: 20rem;
	object-fit: cover;
}

.actions {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
}
</style>

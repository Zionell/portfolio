<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { IProject } from "#shared/types/project.types";

definePageMeta({
	layout: "admin",
});

const { data, refresh } = await useFetch<IProject[]>(api.admin.projects);
const { notifyError } = useAdminToast();

const handleDelete = async (id: string) => {
	try {
		await $fetch(`${api.admin.projects}/${id}`, {
			method: "DELETE",
		});

		await refresh();
	} catch (error) {
		notifyError(error, "Не удалось удалить проект");
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
			<PrimeDataTable :value="data" tableStyle="min-width: 50rem">
				<PrimeColumn header="Name">
					<template #body="{ data }">
						<div :class="$style.tableColumn">
							<img
								:alt="data.name"
								:src="data.image || '/images/default.png'"
								:class="$style.tableImg"
							/>
							<div :class="$style.tableTitle">
								{{ data.name }}
							</div>
						</div>
					</template>
				</PrimeColumn>
				<PrimeColumn header="Status">
					<template #body="{ data }">
						<div :class="$style.tableColumn">
							<PrimeTag
								v-if="data.mainPage"
								severity="success"
								value="Main page"
							/>
							<PrimeTag
								v-if="data.isDeveloping"
								severity="warn"
								value="Developing"
							/>
							<PrimeTag
								v-if="data.isArchived"
								severity="secondary"
								value="Archived"
							/>
						</div>
					</template>
				</PrimeColumn>
				<PrimeColumn header="Actions">
					<template #body="{ data }">
						<div :class="$style.actions">
							<PrimeButton
								label="Edit"
								@click="handleRedirect(data.id)"
							/>
							<PrimeButton
								label="Delete"
								severity="secondary"
								variant="outlined"
								@click="handleDelete(data.id)"
							/>
						</div>
					</template>
				</PrimeColumn>
			</PrimeDataTable>
		</div>
		<div v-else :class="$style.empty">Is Empty</div>
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
	gap: 1.2rem;
	padding: 2rem 0;
}

.tableColumn {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	align-items: center;
}

.tableImg {
	overflow: hidden;
	border-radius: 1rem;
	width: 10rem;
	height: 6rem;
	object-fit: cover;
}

.tableTitle {
	font-size: 1.6rem;
	font-weight: 600;
}

.actions {
	display: flex;
	gap: 1rem;
	align-items: center;
}

.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 20vh;
}
</style>

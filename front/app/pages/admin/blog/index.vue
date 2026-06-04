<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { IBlogListAdmin } from "#shared/types/blog.types";

definePageMeta({
	layout: "admin",
});

const { data, refresh } = await useFetch<IBlogListAdmin>(api.admin.blog);

const handleDelete = async (id: string) => {
	try {
		await $fetch(`${api.admin.blog}/${id}`, {
			method: "DELETE",
		});

		await refresh();
	} catch (error) {
		console.error(error);
	}
};

const handleDeleteSkeleton = async (id: string) => {
	try {
		await $fetch(`${api.admin.skeleton}/${id}`, {
			method: "DELETE",
		});

		await refresh();
	} catch (error) {
		console.error(error);
	}
};

const handleRedirect = (id: string) => {
	navigateTo(`/admin/blog/${id}`);
};

const handleAddNew = (skeletonId?: string) => {
	if (skeletonId) {
		navigateTo(`/admin/blog/new?skeletonId=${skeletonId}`);
	} else {
		navigateTo(`/admin/blog/new?order=${data.value?.length || 0}`);
	}
};
</script>

<template>
	<section :class="$style.AdminSection">
		<AdminHeader title="Blog">
			<PrimeButton label="Add post" @click="handleAddNew" />
		</AdminHeader>

		<PrimeTabs :class="$style.tabs" value="0">
			<PrimeTabList>
				<PrimeTab value="0">Posts</PrimeTab>
				<PrimeTab value="1">Skeletons</PrimeTab>
			</PrimeTabList>
			<PrimeTabPanels>
				<PrimeTabPanel value="0">
					<div :class="$style.list" v-if="data?.posts?.length">
						<PrimeCard v-for="item in data.posts">
							<template #header>
								<NuxtImg
									:alt="item.title"
									:src="item.cover || '/images/default.png'"
								/>
							</template>

							<template #title>{{ item.title }}</template>

							<template #footer>
								<div :class="$style.actions">
									<PrimeButton
										label="Delete"
										severity="secondary"
										variant="outlined"
										class="w-full"
										@click="handleDelete(item.id)"
									/>
									<PrimeButton
										label="Edit"
										@click="handleRedirect(item.id)"
									/>
								</div>
							</template>
						</PrimeCard>
					</div>
					<div v-else :class="$style.empty">Is Empty</div>
				</PrimeTabPanel>
				<PrimeTabPanel value="1">
					<div
						v-if="data?.skeletons?.length"
						:class="$style.skeletons"
					>
						<PrimeCard
							v-for="item in data.skeletons"
							:key="item.id"
							:class="$style.skeleton"
						>
							<template #title>
								<div :class="$style.cardTitle">
									{{ item.title }}
									<PrimeTag
										:severity="
											item.isUsed ? 'danger' : 'success'
										"
										:value="item.isUsed ? 'Used' : 'Free'"
									></PrimeTag>
								</div>
							</template>

							<template #footer>
								<div :class="$style.actions">
									<PrimeButton
										label="Delete"
										severity="secondary"
										variant="outlined"
										class="w-full"
										@click="handleDeleteSkeleton(item.id)"
									/>
									<PrimeButton
										label="Use skeleton"
										@click="handleAddNew(item.id)"
									/>
								</div>
							</template>
						</PrimeCard>
					</div>
					<div v-else :class="$style.empty">Is Empty</div>
				</PrimeTabPanel>
			</PrimeTabPanels>
		</PrimeTabs>
	</section>
</template>

<style lang="scss" module>
.AdminSection {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.tabs {
	padding: 2rem 0;
}

.list,
.skeletons {
	display: grid;
	gap: 1.2rem;
	padding: 2rem 0;
}

.skeleton {
	&:not(:last-child) {
		border-bottom: 1px solid $gray3;
	}
}

.cardTitle,
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

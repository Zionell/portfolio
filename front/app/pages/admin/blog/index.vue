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

const handleAddNew = (skeletonId?: string | null) => {
	if (skeletonId) {
		navigateTo(`/admin/blog/new?skeletonId=${skeletonId}`);
	} else {
		navigateTo(`/admin/blog/new?order=${data.value?.posts?.length || 0}`);
	}
};
</script>

<template>
	<section :class="$style.AdminSection">
		<AdminHeader title="Blog">
			<PrimeButton label="Add post" @click="handleAddNew(null)" />
		</AdminHeader>

		<PrimeTabs :class="$style.tabs" value="0">
			<PrimeTabList>
				<PrimeTab value="0">Posts</PrimeTab>
				<PrimeTab value="1">Skeletons</PrimeTab>
			</PrimeTabList>
			<PrimeTabPanels>
				<PrimeTabPanel value="0">
					<div :class="$style.list" v-if="data?.posts?.length">
						<PrimeDataTable
							:value="data.posts"
							tableStyle="min-width: 50rem"
						>
							<PrimeColumn header="Title">
								<template #body="{ data }">
									<div :class="$style.tableColumn">
										<img
											:alt="data.title"
											:src="
												data.cover ||
												'/images/default.png'
											"
											:class="$style.tableImg"
										/>
										<div :class="$style.tableTitle">
											{{ data.title }}
										</div>
									</div>
								</template>
							</PrimeColumn>
							<PrimeColumn header="Is published?">
								<template #body="{ data }">
									<div :class="$style.tableColumn">
										<PrimeBadge
											:severity="
												data.isPublished
													? 'success'
													: 'danger'
											"
										>
											{{ data.isPublished }}
										</PrimeBadge>
									</div>
								</template>
							</PrimeColumn>
							<PrimeColumn header="Views">
								<template #body="{ data }">
									<div :class="$style.tableColumn">
										{{ data.views }}
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
				</PrimeTabPanel>
				<PrimeTabPanel value="1">
					<div
						v-if="data?.skeletons?.length"
						:class="$style.skeletons"
					>
						<PrimeDataTable
							:value="data.skeletons"
							tableStyle="min-width: 50rem"
						>
							<PrimeColumn header="Title">
								<template #body="{ data }">
									<div :class="$style.tableTitle">
										{{ data.title }}
									</div>
								</template>
							</PrimeColumn>
							<PrimeColumn header="Ыефегы">
								<template #body="{ data }">
									<PrimeTag
										:severity="
											data.isUsed ? 'danger' : 'success'
										"
										:value="data.isUsed ? 'Used' : 'Free'"
									></PrimeTag>
								</template>
							</PrimeColumn>
							<PrimeColumn header="Actions">
								<template #body="{ data }">
									<div :class="$style.actions">
										<PrimeButton
											label="Use skeleton"
											@click="handleAddNew(data.id)"
										/>
										<PrimeButton
											label="Delete"
											severity="secondary"
											variant="outlined"
											@click="
												handleDeleteSkeleton(data.id)
											"
										/>
									</div>
								</template>
							</PrimeColumn>
						</PrimeDataTable>
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

.tableColumn {
	display: flex;
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

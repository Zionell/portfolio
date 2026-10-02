<script setup lang="ts">
import { api } from "~/assets/data/api";
import type {
	IBlogListAdmin,
	IFormDataSkeleton,
} from "#shared/types/blog.types";

definePageMeta({
	layout: "admin",
});

const { data, refresh } = await useFetch<IBlogListAdmin>(api.admin.blog);
const { notifyError } = useAdminToast();
const { locales } = useI18n();

const activeTab = ref("0");
const isSkeletonDialogOpen = ref(false);
const isSkeletonSaving = ref(false);

const emptySkeleton = (): IFormDataSkeleton => ({
	title: "",
	body: "",
	lang: "ru",
	projectId: null,
	commits: "",
});

const skeletonForm = ref<IFormDataSkeleton>(emptySkeleton());

// у темы текст — excerpt будущего поста, у PR хватает коммитов
const isSkeletonValid = computed(
	() =>
		Boolean(skeletonForm.value.title.trim()) &&
		Boolean(
			skeletonForm.value.body.trim() ||
			(skeletonForm.value.projectId &&
				skeletonForm.value.commits?.trim()),
		),
);

const openSkeletonDialog = () => {
	skeletonForm.value = emptySkeleton();
	isSkeletonDialogOpen.value = true;
};

const handleCreateSkeleton = async () => {
	if (!isSkeletonValid.value) return;

	isSkeletonSaving.value = true;

	try {
		const { projectId, commits, ...rest } = skeletonForm.value;

		await $fetch(api.admin.skeleton, {
			method: "POST",
			body: {
				...rest,
				projectId,
				// коммиты имеют смысл только у скелетона проекта
				commits: projectId ? commits : null,
			},
		});

		isSkeletonDialogOpen.value = false;
		activeTab.value = "1";
		await refresh();
	} catch (error) {
		notifyError(error, "Не удалось создать заготовку");
	} finally {
		isSkeletonSaving.value = false;
	}
};

const handleDelete = async (id: string) => {
	try {
		await $fetch(`${api.admin.blog}/${id}`, {
			method: "DELETE",
		});

		await refresh();
	} catch (error) {
		notifyError(error, "Не удалось удалить пост");
	}
};

const handleDeleteSkeleton = async (id: string) => {
	try {
		await $fetch(`${api.admin.skeleton}/${id}`, {
			method: "DELETE",
		});

		await refresh();
	} catch (error) {
		notifyError(error, "Не удалось удалить заготовку");
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
			<div :class="$style.actions">
				<PrimeButton
					label="Add skeleton"
					severity="secondary"
					variant="outlined"
					@click="openSkeletonDialog"
				/>
				<PrimeButton label="Add post" @click="handleAddNew(null)" />
			</div>
		</AdminHeader>

		<PrimeTabs v-model:value="activeTab" :class="$style.tabs">
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
							<PrimeColumn header="Lang">
								<template #body="{ data }">
									{{ data.lang }}
								</template>
							</PrimeColumn>
							<PrimeColumn header="Project">
								<template #body="{ data }">
									<span v-if="data.project">
										{{ data.project.name }}
									</span>
									<span
										v-else-if="data.repo_name"
										:class="$style.muted"
									>
										{{ data.repo_name }}
									</span>
									<span v-else :class="$style.muted">—</span>
								</template>
							</PrimeColumn>
							<PrimeColumn header="Status">
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

		<PrimeDialog
			v-model:visible="isSkeletonDialogOpen"
			header="New skeleton"
			modal
			:style="{ width: 'min(64rem, 100%)' }"
		>
			<form
				:class="$style.dialogForm"
				@submit.prevent="handleCreateSkeleton"
			>
				<PrimeFloatLabel variant="on">
					<PrimeInputText
						id="skeletonTitle"
						v-model="skeletonForm.title"
						fluid
					/>
					<label for="skeletonTitle">
						{{ skeletonForm.projectId ? "PR title" : "Title" }}
					</label>
				</PrimeFloatLabel>

				<PrimeFloatLabel variant="on">
					<PrimeTextarea
						id="skeletonBody"
						v-model="skeletonForm.body"
						rows="5"
						auto-resize
						fluid
					/>
					<label for="skeletonBody">
						{{
							skeletonForm.projectId
								? "PR description"
								: "Text (post excerpt)"
						}}
					</label>
				</PrimeFloatLabel>

				<div :class="$style.dialogRow">
					<PrimeSelectButton
						v-model="skeletonForm.lang"
						:options="locales"
						option-label="name"
						option-value="code"
						:allow-empty="false"
					/>
					<PrimeFloatLabel variant="on" :class="$style.grow">
						<PrimeSelect
							id="skeletonProject"
							v-model="skeletonForm.projectId"
							:options="data?.projects || []"
							option-label="name"
							option-value="id"
							show-clear
							fluid
						/>
						<label for="skeletonProject"
							>Project (for PR posts)</label
						>
					</PrimeFloatLabel>
				</div>

				<PrimeFloatLabel v-if="skeletonForm.projectId" variant="on">
					<PrimeTextarea
						id="skeletonCommits"
						v-model="skeletonForm.commits"
						rows="5"
						auto-resize
						fluid
					/>
					<label for="skeletonCommits">Commits, one per line</label>
				</PrimeFloatLabel>

				<div :class="$style.dialogActions">
					<PrimeButton
						label="Cancel"
						severity="secondary"
						variant="outlined"
						@click="isSkeletonDialogOpen = false"
					/>
					<PrimeButton
						type="submit"
						label="Create"
						:disabled="!isSkeletonValid"
						:loading="isSkeletonSaving"
					/>
				</div>
			</form>
		</PrimeDialog>
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

.muted {
	color: $gray4;
}

.dialogForm {
	display: grid;
	gap: 2rem;
	padding-top: 0.8rem;
}

.dialogRow {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 1.6rem;
}

.grow {
	flex: 1;
	min-width: 20rem;
}

.dialogActions {
	display: flex;
	justify-content: flex-end;
	gap: 1rem;
}

.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 20vh;
}
</style>

<script setup lang="ts">
import { api } from "~/assets/data/api";
import { useAdminUpload } from "~/composables/useAdminUpload";
import type { HomeSkill } from "~~/generated/prisma/client";
import type {
	IFormDataProject,
	IResponseProject,
	IProject,
} from "#shared/types/project.types";
import { resolveFile } from "~/assets/ts/utils";
import AdminSectionFooter from "~/components/admin/common/AdminSectionFooter.vue";
import { getImage } from "~/assets/ts/image";

definePageMeta({
	layout: "admin",
});

const route = useRoute();
const { uploadFile } = useAdminUpload();

const formData = ref<IFormDataProject>({
	name: "",
	slug: "",
	link: "",
	image: "",
	order: route.query?.order ? Number(route.query.order) : 0,
	stack: [],
	isDeveloping: false,
	isArchived: false,
});
const skills = ref<HomeSkill[][]>([[], []]);
const isLoading = ref(false);

const isNew = computed(() => route.params.id === "new");

const setFormData = () => {
	if (data.value?.project) {
		formData.value = data.value.project;

		skills.value[1] = formData.value.stack;
	}
	skills.value[0] = data.value?.skills || [];
};

const { data } = await useAsyncData<IResponseProject>(
	() => formData.value.name || "project",
	async () => {
		let skills = null;
		let project = null;

		if (isNew.value) {
			skills = await $fetch<HomeSkill[]>(api.admin.skills);
		} else {
			[project, skills] = await Promise.all([
				$fetch<IProject>(
					`${api.admin.projects}/${route.params.id}`,
				),
				$fetch<HomeSkill[]>(api.admin.skills),
			]);
		}

		return { project, skills };
	},
);

if (data.value) {
	setFormData();
}

const onImageChange = async (event: any) => {
	const file = resolveFile(event);
	if (!file) return;

	try {
		formData.value.image = await uploadFile(file, "projects");
	} catch (error) {
		console.error("onProjectImageChange", error);
	}
};

const handleGenerate = async () => {
	if (formData.value.slug && formData.value.link) {
		formData.value.image = await getImage(
			formData.value.link,
			formData.value.slug,
		);
	}
};

const setStack = (value: HomeSkill[][]) => {
	formData.value.stack = value[1] || [];
};

const handleSave = async () => {
	isLoading.value = true;

	try {
		await $fetch(api.admin.projects, {
			method: isNew.value ? "POST" : 'PATCH',
			body: formData.value,
		});

		if (isNew.value) {
			navigateTo(`/admin/projects`);
		}
	} catch (error) {
		console.error("Error saving project:", error);
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<section :class="$style.AdminSection">
		<AdminHeader :title="isNew ? 'New project' : formData.name" />

		<div :class="$style.form">
			<div :class="$style.row">
				<PrimeInputNumber
					v-model="formData.order"
					inputId="horizontal-buttons"
					showButtons
					buttonLayout="horizontal"
				>
					<template #incrementbuttonicon>
						<span class="pi pi-plus" />
					</template>
					<template #decrementbuttonicon>
						<span class="pi pi-minus" />
					</template>
				</PrimeInputNumber>
				<PrimeFloatLabel variant="on">
					<PrimeInputText id="name" v-model="formData.name" />
					<label for="name">Name</label>
				</PrimeFloatLabel>
				<PrimeFloatLabel variant="on">
					<PrimeInputText id="slug" v-model="formData.slug" />
					<label for="slug">Slug</label>
				</PrimeFloatLabel>
				<PrimeFloatLabel variant="on">
					<PrimeInputText id="link" v-model="formData.link" />
					<label for="link">Link</label>
				</PrimeFloatLabel>
				<div :class="$style.row">
					<PrimeCheckbox
						inputId="isDeveloping"
						size="large"
						binary
						v-model="formData.isDeveloping"
					/>
					<label for="isDeveloping">Is developing?</label>
				</div>
				<div :class="$style.row">
					<PrimeCheckbox
						inputId="isArchived"
						size="large"
						binary
						v-model="formData.isArchived"
					/>
					<label for="isArchived">Is archived?</label>
				</div>
			</div>
			<div :class="$style.block">
				<div>Stack</div>
				<PrimePickList
					v-model="skills"
					dataKey="id"
					@update:modelValue="setStack"
				>
					<template #option="{ option }">
						{{ option.label }}
					</template>
				</PrimePickList>
			</div>

			<PrimePanel header="Image" toggleable>
				<div :class="$style.row">
					<PrimeFileUpload
						mode="basic"
						customUpload
						auto
						chooseLabel="Загрузить"
						accept="image/*"
						class="admin-input"
						@uploader="onImageChange"
					>
					</PrimeFileUpload>
					<PrimeButton
						label="Generate preview"
						@click="handleGenerate"
					/>
					<NuxtImg
						v-if="formData.image"
						:src="formData.image"
						:class="$style.preview"
						alt="Project image"
					/>
				</div>
			</PrimePanel>
		</div>

		<AdminSectionFooter :is-saving="isLoading" @save="handleSave" />
	</section>
</template>

<style lang="scss" module>
.AdminSection {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.form {
	display: grid;
	gap: 2.4rem;
	padding: 1.6rem 0 3.2rem;
}

.row {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 2rem;
}

.block {
	display: grid;
	gap: 2rem;
}

.preview {
	width: 20rem;
	height: 10rem;
	object-fit: cover;
}
</style>

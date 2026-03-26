<script setup lang="ts">
import type { IHomeData, IProject } from "#shared/types/home.types";
import { api } from "~/assets/data/api";
import { useAdminUpload } from "~/composables/useAdminUpload";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import FileUpload from "primevue/fileupload";
import Checkbox from "primevue/checkbox";
import PickList from "primevue/picklist";

const route = useRoute();

definePageMeta({
	layout: "admin",
});

const { data, refresh } = await useFetch<IHomeData>(api.home);
const isNew = computed(() => route.params.slug === "new");

const project = computed<IProject | null>(() => {
	return data.value?.projects.find((item) => item.slug === route.params.slug) || null;
});

const form = reactive({
	name: "",
	slug: "",
	link: "",
	stack: "",
	image: "",
	order: null as number | null,
	isDeveloping: false,
	isArchived: false,
});

const allSkills = computed(() => data.value?.skills.map((item) => item.label) || []);
const pickListValue = ref<[string[], string[]]>([[], []]);

const isUploading = ref(false);
const uploadError = ref("");
const { uploadFile } = useAdminUpload();
const isSaving = ref(false);
const saveError = ref("");
const saveSuccess = ref("");

const syncPickList = (selected: string[]) => {
	const source = allSkills.value.filter((skill) => !selected.includes(skill));
	pickListValue.value = [source, selected];
};

const resetForm = () => {
	form.name = "";
	form.slug = "";
	form.link = "";
	form.stack = "";
	form.image = "";
	form.order = null;
	form.isDeveloping = false;
	form.isArchived = false;
	syncPickList([]);
};

watch(
	project,
	(value) => {
		if (!value) return;
		form.name = value.name;
		form.slug = value.slug;
		form.link = value.link;
		form.stack = value.stack.join(", ");
		form.image = value.image || "";
		form.order = value.order ?? null;
		form.isDeveloping = value.isDeveloping;
		form.isArchived = value.isArchived;
		const selected = value.stack || [];
		syncPickList(selected);
	},
	{ immediate: true },
);

watch(
	isNew,
	(value) => {
		if (value) resetForm();
	},
	{ immediate: true },
);

watch(
	allSkills,
	(skills) => {
		const selected = pickListValue.value[1] || [];
		syncPickList(selected);
	},
	{ immediate: true },
);

watch(
	() => pickListValue.value[1],
	(value) => {
		form.stack = value.join(", ");
	},
	{ deep: true },
);

const resolveFile = (payload: any): File | null => {
	const files = payload?.files || payload?.target?.files;
	if (!files) return null;
	return Array.isArray(files) ? files[0] : files?.[0] || null;
};

const onProjectImageChange = async (event: any) => {
	const file = resolveFile(event);
	if (!file) return;
	isUploading.value = true;
	uploadError.value = "";
	try {
		form.image = await uploadFile(file, "projects");
	} catch (error) {
		uploadError.value = "Не удалось загрузить изображение.";
	} finally {
		isUploading.value = false;
	}
};

const saveProject = async () => {
	saveError.value = "";
	saveSuccess.value = "";

	if (!form.slug.trim() || !form.name.trim()) {
		saveError.value = "Заполните slug и название.";
		return;
	}

	isSaving.value = true;
	try {
		await $fetch("/api/v1/admin/projects/save", {
			method: "POST",
			body: {
				name: form.name.trim(),
				slug: form.slug.trim(),
				link: form.link.trim(),
				stack: pickListValue.value[1] || [],
				image: form.image || "",
				order: form.order === null || form.order === undefined || form.order === ""
					? null
					: Number(form.order),
				isDeveloping: form.isDeveloping,
				isArchived: form.isArchived,
			},
		});
		saveSuccess.value = "Сохранено.";
		await refresh();
		if (isNew.value) {
			navigateTo(`/admin/projects/${form.slug.trim()}`);
		}
	} catch (error) {
		saveError.value = "Не удалось сохранить проект.";
	} finally {
		isSaving.value = false;
	}
};
</script>

<template>
	<section class="admin-section">
		<header class="admin-header">
			<div>
				<h1 class="admin-title">Редактировать проект</h1>
				<p class="admin-subtitle">
					{{ isNew ? "Новый проект" : project?.name || "Проект не найден" }}
				</p>
			</div>
			<div class="admin-actions">
				<Button
					class="admin-button"
					label="Сохранить"
					type="button"
					:loading="isSaving"
					@click="saveProject"
				/>
			</div>
		</header>

		<form v-if="project || isNew" class="admin-form">
			<div class="admin-row">
				<label class="admin-field">
					<span>Название</span>
					<InputText v-model="form.name" class="admin-input" />
				</label>
				<label class="admin-field">
					<span>Slug</span>
					<InputText v-model="form.slug" class="admin-input" />
				</label>
			</div>
			<div class="admin-row">
				<label class="admin-field">
					<span>Ссылка</span>
					<InputText v-model="form.link" class="admin-input" />
				</label>
				<label class="admin-field">
					<span>Стек (через запятую)</span>
					<InputText v-model="form.stack" class="admin-input" disabled />
				</label>
			</div>
			<div class="admin-row">
				<label class="admin-field">
					<span>Порядок</span>
					<InputText v-model="form.order" type="number" class="admin-input" />
				</label>
			</div>
			<div class="admin-field">
				<span>Стек проекта</span>
				<ClientOnly>
					<PickList
						v-model="pickListValue"
						listStyle="height: 260px"
						:showSourceControls="false"
						:showTargetControls="false"
					>
						<template #item="slotProps">
							<span>{{ slotProps.item }}</span>
						</template>
					</PickList>
					<template #fallback>
						<div class="admin-helper">Загрузка списка...</div>
					</template>
				</ClientOnly>
			</div>
			<label class="admin-field">
				<span>Изображение</span>
				<ClientOnly>
					<FileUpload
						mode="basic"
						customUpload
						auto
						chooseLabel="Загрузить"
						accept="image/*"
						class="admin-input"
						@uploader="onProjectImageChange"
					/>
					<template #fallback>
						<div class="admin-helper">Загрузка формы...</div>
					</template>
				</ClientOnly>
				<small v-if="form.image" class="admin-helper">{{ form.image }}</small>
				<small v-if="isUploading" class="admin-helper">Загрузка...</small>
				<small v-if="uploadError" class="admin-error">{{ uploadError }}</small>
			</label>
			<small v-if="saveSuccess" class="admin-helper">{{ saveSuccess }}</small>
			<small v-if="saveError" class="admin-error">{{ saveError }}</small>
			<div class="admin-row">
				<label class="admin-field">
					<span>В разработке</span>
					<Checkbox v-model="form.isDeveloping" binary />
				</label>
				<label class="admin-field">
					<span>Архив</span>
					<Checkbox v-model="form.isArchived" binary />
				</label>
			</div>
		</form>

		<p v-else class="admin-subtitle">Проект не найден.</p>
	</section>
</template>

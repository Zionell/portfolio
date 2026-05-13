<script setup lang="ts">
import type { IHomeData, IBlogPost } from "#shared/types/home.types";
import { api } from "~/assets/data/api";
import { useAdminUpload } from "~/composables/useAdminUpload";
import InputText from "primevue/inputtext";
import Editor from "primevue/editor";
import FileUpload from "primevue/fileupload";

const route = useRoute();

definePageMeta({
	layout: "admin",
});

const { data } = await useFetch<IHomeData>(api.home);

const post = computed<IBlogPost | null>(() => {
	return data.value?.blog.find((item) => item.slug === route.params.slug) || null;
});

const form = reactive({
	title: "",
	slug: "",
	excerpt: "",
	date: "",
	readTime: 1,
	tags: "",
	cover: "",
});

const isUploading = ref(false);
const uploadError = ref("");
const { uploadFile } = useAdminUpload();
const isSaving = ref(false);
const isPublishing = ref(false);
const saveMessage = ref("");
const saveError = ref("");

watch(
	post,
	(value) => {
		if (!value) return;
		form.title = value.title;
		form.slug = value.slug;
		form.excerpt = value.excerpt;
		form.date = value.date;
		form.readTime = value.readTime;
		form.tags = value.tags.join(", ");
		form.cover = value.cover;
	},
	{ immediate: true },
);

const resolveFile = (payload: any): File | null => {
	const files = payload?.files || payload?.target?.files;
	if (!files) return null;
	return Array.isArray(files) ? files[0] : files?.[0] || null;
};

const onCoverChange = async (event: any) => {
	const file = resolveFile(event);
	if (!file) return;
	isUploading.value = true;
	uploadError.value = "";
	try {
		form.cover = await uploadFile(file, "blog");
	} catch (error) {
		uploadError.value = "Не удалось загрузить изображение.";
	} finally {
		isUploading.value = false;
	}
};

const handleSave = async () => {
	saveMessage.value = "";
	saveError.value = "";
	isSaving.value = true;
	try {
		await $fetch("/api/v1/admin/posts/save", {
			method: "POST",
			body: {
				slug: form.slug,
				title: form.title,
				excerpt: form.excerpt,
				date: form.date,
				readTime: form.readTime,
				cover: form.cover,
				tags: form.tags
					.split(",")
					.map((item) => item.trim())
					.filter(Boolean),
			},
		});
		saveMessage.value = "Черновик сохранен.";
	} catch (error) {
		saveError.value = "Не удалось сохранить.";
	} finally {
		isSaving.value = false;
	}
};

const handlePublish = async () => {
	saveMessage.value = "";
	saveError.value = "";
	if (!form.slug) {
		saveError.value = "Сначала заполните slug.";
		return;
	}
	isPublishing.value = true;
	try {
		await $fetch("/api/v1/admin/posts/publish", {
			method: "POST",
			body: { slug: form.slug },
		});
		saveMessage.value = "Пост опубликован.";
	} catch (error) {
		saveError.value = "Не удалось опубликовать.";
	} finally {
		isPublishing.value = false;
	}
};
</script>

<template>
	<section class="admin-section">
		<header class="admin-header">
			<div>
				<h1 class="admin-title">Редактировать пост</h1>
				<p class="admin-subtitle">{{ post?.title || "Пост не найден" }}</p>
			</div>
				<div class="admin-actions">
					<UButton
						class="admin-button"
						type="button"
						:loading="isSaving"
						@click="handleSave"
					>
						Сохранить
					</UButton>
					<UButton
						class="admin-button"
						type="button"
						:disabled="isPublishing"
						@click="handlePublish"
					>
						Опубликовать
					</UButton>
				</div>
		</header>
		<p v-if="saveMessage" class="admin-helper">{{ saveMessage }}</p>
		<p v-if="saveError" class="admin-error">{{ saveError }}</p>

		<form v-if="post" class="admin-form">
			<div class="admin-row">
				<label class="admin-field">
					<span>Заголовок</span>
					<InputText v-model="form.title" class="admin-input" />
				</label>
				<label class="admin-field">
					<span>Slug</span>
					<InputText v-model="form.slug" class="admin-input" />
				</label>
			</div>
			<label class="admin-field">
				<span>Краткое описание</span>
				<ClientOnly>
					<Editor v-model="form.excerpt" editorStyle="height: 180px" />
					<template #fallback>
						<div class="admin-helper">Редактор загружается...</div>
					</template>
				</ClientOnly>
			</label>
			<div class="admin-row">
				<label class="admin-field">
					<span>Дата</span>
					<InputText v-model="form.date" class="admin-input" />
				</label>
				<label class="admin-field">
					<span>Время чтения</span>
					<InputText v-model.number="form.readTime" class="admin-input" />
				</label>
			</div>
			<div class="admin-row">
				<label class="admin-field">
					<span>Теги (через запятую)</span>
					<InputText v-model="form.tags" class="admin-input" />
				</label>
				<label class="admin-field">
					<span>Обложка</span>
					<ClientOnly>
						<FileUpload
							mode="basic"
							customUpload
							auto
							chooseLabel="Загрузить"
							accept="image/*"
							class="admin-input"
							@uploader="onCoverChange"
						/>
						<template #fallback>
							<div class="admin-helper">Загрузка формы...</div>
						</template>
					</ClientOnly>
					<small v-if="form.cover" class="admin-helper">{{ form.cover }}</small>
					<small v-if="isUploading" class="admin-helper">Загрузка...</small>
					<small v-if="uploadError" class="admin-error">{{ uploadError }}</small>
				</label>
			</div>
		</form>

		<p v-else class="admin-subtitle">Пост не найден.</p>
	</section>
</template>

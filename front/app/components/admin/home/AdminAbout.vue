<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { HomeAbout, HomeAboutText } from "~~/generated/prisma/client";
import AdminSectionFooter from "~/components/admin/common/AdminSectionFooter.vue";
import { useAdminUpload } from "~/composables/useAdminUpload";

interface IAbout extends HomeAbout {
	text: HomeAboutText[];
}

const { locale, locales } = useI18n();

const imageSrc = ref<string>("");
const text = ref<Partial<HomeAboutText>[]>([]);
const isLoading = ref<boolean>(false);
const isUploading = ref(false);
const uploadError = ref("");
const { uploadFile } = useAdminUpload();

locales.value.forEach((l) => {
	text.value.push({
		lang: l.code,
		text: "",
	});
});

const { data } = await useFetch<IAbout>(api.admin.about);

if (data.value) {
	imageSrc.value = data.value.image || "";

	if (data.value.text?.length) {
		text.value = data.value.text;
	}
}

const handleSave = async () => {
	try {
		isLoading.value = true;

		await $fetch(api.admin.about, {
			method: "POST",
			// body: {
			// 	image: aboutForm.image,
			// 	text: aboutForm.text.filter((item) => item.trim().length),
			// },
		});
	} catch (error) {
		console.error(error);
	} finally {
		isLoading.value = false;
	}
};
const src = ref(null);

const onFileSelect = (event) => {
	const file = event.files[0];
	const reader = new FileReader();

	reader.onload = async (e) => {
		src.value = e.target.result;
	};

	reader.readAsDataURL(file);
};

const resolveFile = (payload: any): File | null => {
	const files = payload?.files || payload?.target?.files;
	if (!files) return null;
	return Array.isArray(files) ? files[0] : files?.[0] || null;
};

const onAboutImageChange = async (event: any) => {
	const file = resolveFile(event);

	if (!file) return;
	isUploading.value = true;
	uploadError.value = "";

	try {
		imageSrc.value = await uploadFile(file, "about");
	} catch (error) {
		uploadError.value = "Не удалось загрузить изображение.";
	} finally {
		isUploading.value = false;
	}
};

const addAboutParagraph = () => {
	aboutForm.text.push("");
};

const removeAboutParagraph = (index: number) => {
	text.value.splice(index, 1);
};
</script>

<template>
	<div :class="$style.AdminAbout">
		<PrimePanel header="Image" toggleable>
			<div class="row">
				<PrimeFileUpload
					mode="basic"
					customUpload
					auto
					chooseLabel="Загрузить"
					accept="image/*"
					class="admin-input"
					@uploader="onAboutImageChange"
				>
					<small v-if="isUploading" class="admin-helper">
						Loading...
					</small>
					<small v-if="uploadError" class="admin-error">
						{{ uploadError }}
					</small>
				</PrimeFileUpload>
				<NuxtImg
					:src="imageSrc"
					:class="$style.preview"
					alt="About image"
				/>
			</div>
		</PrimePanel>
		<PrimeEditor
			v-model="text[0].text"
			:class="$style.editor"
			editorStyle="height: 460px"
		/>
		<PrimePanel
			v-for="(text, ind) in text"
			:key="`Paragraph_${ind}`"
			:header="`Paragraph ${text.lang}`"
			toggleable
		>
			<div :class="$style.form">
				<Button
					:class="$style.removeBtn"
					label="Удалить"
					@click="removeAboutParagraph(ind)"
				/>
				<PrimeEditor
					v-model="text.text"
					:class="$style.editor"
					editorStyle="height: 460px"
				/>
				<!--				<PrimeFloatLabel variant="on">-->
				<!--					<PrimeEdi id="on_label" v-model="hero.title" />-->
				<!--					<label for="on_label">Title</label>-->
				<!--				</PrimeFloatLabel>-->
				<!--				<PrimeFloatLabel variant="on">-->
				<!--					<PrimeInputText id="on_label" v-model="hero.subtitle" />-->
				<!--					<label for="on_label">Subtitle</label>-->
				<!--				</PrimeFloatLabel>-->
			</div>
		</PrimePanel>
		<Button
			:class="['admin-button']"
			label="Добавить абзац"
			@click="addAboutParagraph"
		/>

		<AdminSectionFooter :is-saving="isLoading" @save="handleSave" />
	</div>
</template>

<style module lang="scss">
.AdminAbout,
.form {
	display: grid;
	gap: 2.4rem;
	padding-top: 1.6rem;
}

.preview {
	width: 20rem;
	height: 20rem;
}
</style>

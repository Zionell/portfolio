<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { HomeAbout, HomeAboutText } from "~~/generated/prisma/client";
import AdminSectionFooter from "~/components/admin/common/AdminSectionFooter.vue";
import { useAdminUpload } from "~/composables/useAdminUpload";
import { resolveFile } from "~/assets/ts/utils";
import { cleanHtmlText } from "#server/utils/text-utils";

interface IAbout extends HomeAbout {
	text: HomeAboutText[];
}

const { locales } = useI18n();

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

		const sanitizedText = text.value.map((item) => ({
			...item,
			text: cleanHtmlText(item.text || ""),
		}));

		await $fetch(api.admin.about, {
			method: "POST",
			body: {
				id: data.value?.id,
				image: imageSrc.value,
				text: sanitizedText,
			},
		});
	} catch (error) {
		console.error(error);
	} finally {
		isLoading.value = false;
	}
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
		<PrimePanel
			v-for="(text, ind) in text"
			:key="`Paragraph_${ind}`"
			:header="`Paragraph ${text.lang}`"
			toggleable
		>
			<div :class="$style.form">
				<PrimeEditor
					v-model="text.text"
					:class="$style.editor"
					editorStyle="height: 460px"
				/>
			</div>
		</PrimePanel>

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

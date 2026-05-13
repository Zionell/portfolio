<script setup lang="ts">
import { api } from "~/assets/data/api";
import AdminSectionFooter from "~/components/admin/common/AdminSectionFooter.vue";
import { useAdminUpload } from "~/composables/useAdminUpload";
import { resolveFile } from "~/assets/ts/utils";
import type { ISettingsSeo } from "#shared/types/settings.types";

const { locales } = useI18n();

const imageSrc = ref<string>("");
const content = ref<Partial<SettingsSeoContent>[]>([]);
const isLoading = ref<boolean>(false);
const { uploadFile } = useAdminUpload();

locales.value.forEach((l) => {
	content.value.push({
		lang: l.code,
		title: "",
		description: "",
		link: "",
		author: "",
	});
});

const { data } = await useFetch<ISettingsSeo>(api.admin.settings.seo);

if (data.value) {
	imageSrc.value = data.value?.image || "";

	if (data.value.content?.length) {
		content.value = data.value.content;
	}
}

const handleSave = async () => {
	try {
		isLoading.value = true;

		await $fetch(api.admin.settings.seo, {
			method: "POST",
			body: {
				id: data.value?.id,
				image: imageSrc.value,
				content: content.value,
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

	try {
		imageSrc.value = await uploadFile(file, "seo");
	} catch (error) {
		console.error("onAboutImageChange", error);
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
					@uploader="onAboutImageChange"
				/>
				<NuxtImg
					v-if="imageSrc"
					:src="imageSrc"
					:class="$style.preview"
					alt="About image"
				/>
			</div>
		</PrimePanel>
		<PrimePanel
			v-for="(item, ind) in content"
			:key="`Seo_${ind}`"
			:header="`Seo ${item.lang}`"
			toggleable
		>
			<div :class="$style.form">
				<PrimeFloatLabel variant="on">
					<PrimeInputText id="on_title" v-model="item.title" />
					<label for="on_title">Title</label>
				</PrimeFloatLabel>
				<PrimeFloatLabel variant="on">
					<PrimeInputText id="on_link" v-model="item.link" />
					<label for="on_link">Link</label>
				</PrimeFloatLabel>
				<PrimeFloatLabel variant="on">
					<PrimeInputText id="on_author" v-model="item.author" />
					<label for="on_author">Author</label>
				</PrimeFloatLabel>
				<PrimeTextarea
					v-model="item.description"
					rows="10"
					cols="50"
					style="resize: none"
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

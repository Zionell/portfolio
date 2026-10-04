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

definePageMeta({
	layout: "admin",
});

const route = useRoute();
const { uploadFile } = useAdminUpload();
const { notifySaved, notifyError } = useAdminToast();

const formData = ref<IFormDataProject>({
	name: "",
	slug: "",
	link: "",
	image: "",
	order: route.query?.order ? Number(route.query.order) : 0,
	stack: [],
	mainPage: false,
	isDeveloping: false,
	isArchived: false,
	showDetail: false,
	eyebrow_en: "",
	eyebrow_ru: "",
	description_en: "",
	description_ru: "",
	blocks: [],
	images: [],
	links: [],
});
const skills = ref<HomeSkill[][]>([[], []]);
const isLoading = ref(false);

const isNew = computed(() => route.params.id === "new");

const setFormData = () => {
	const project = data.value?.project;

	if (project) {
		formData.value = {
			...project,
			eyebrow_en: project.eyebrow_en || "",
			eyebrow_ru: project.eyebrow_ru || "",
			description_en: project.description_en || "",
			description_ru: project.description_ru || "",
			// массивы копируем: иначе inputs правят ответ useAsyncData на месте
			blocks: (project.blocks || []).map((block) => ({ ...block })),
			images: (project.images || []).map((image) => ({ ...image })),
			links: (project.links || []).map((link) => ({ ...link })),
		};

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
				$fetch<IProject>(`${api.admin.projects}/${route.params.id}`),
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
		formData.value.image = await uploadFile(file);
	} catch (error) {
		notifyError(error, "Не удалось загрузить обложку");
	}
};

const onShotChange = async (event: any, index: number) => {
	const file = resolveFile(event);
	const shot = formData.value.images[index];
	if (!file || !shot) return;

	try {
		shot.image = await uploadFile(file);
	} catch (error) {
		notifyError(error, "Не удалось загрузить скриншот");
	}
};

const setStack = (value: HomeSkill[][]) => {
	formData.value.stack = value[1] || [];
};

const move = (list: unknown[], index: number, offset: number) => {
	const target = index + offset;
	if (target < 0 || target >= list.length) return;

	const [item] = list.splice(index, 1);
	list.splice(target, 0, item);
};

const addBlock = () => {
	formData.value.blocks.push({
		title_en: "",
		title_ru: "",
		text_en: "",
		text_ru: "",
	});
};

const addShot = () => {
	formData.value.images.push({
		image: "",
		caption_en: "",
		caption_ru: "",
		isWide: false,
	});
};

const addLink = () => {
	formData.value.links.push({
		label_en: "",
		label_ru: "",
		url: "",
	});
};

const counter = (index: number) => String(index + 1).padStart(2, "0");

const handleSave = async () => {
	isLoading.value = true;

	try {
		await $fetch(api.admin.projects, {
			method: isNew.value ? "POST" : "PATCH",
			body: formData.value,
		});

		notifySaved();

		if (isNew.value) {
			navigateTo(`/admin/projects`);
		}
	} catch (error) {
		notifyError(error, "Не удалось сохранить проект");
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
						inputId="mainPage"
						size="large"
						binary
						v-model="formData.mainPage"
					/>
					<label for="mainPage">On main page?</label>
				</div>
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

			<PrimePanel header="Detail page" toggleable>
				<div :class="[$style.row, $style.detailSwitch]">
					<PrimeToggleSwitch
						v-model="formData.showDetail"
						inputId="showDetail"
					/>
					<label for="showDetail">Показывать детальную страницу</label>
				</div>

				<div :class="$style.langGrid">
					<div
						v-for="lang in ['en', 'ru']"
						:key="`lead_${lang}`"
						:class="$style.block"
					>
						<div :class="$style.langLabel">{{ lang }}</div>
						<PrimeFloatLabel variant="on">
							<PrimeInputText
								:id="`eyebrow_${lang}`"
								v-model="formData[`eyebrow_${lang}`]"
							/>
							<label :for="`eyebrow_${lang}`">
								Eyebrow (публичный проект · в разработке)
							</label>
						</PrimeFloatLabel>
						<PrimeFloatLabel variant="on">
							<PrimeTextarea
								:id="`description_${lang}`"
								v-model="formData[`description_${lang}`]"
								rows="4"
								autoResize
							/>
							<label :for="`description_${lang}`">
								Description
							</label>
						</PrimeFloatLabel>
					</div>
				</div>
			</PrimePanel>

			<PrimePanel header="Blocks" toggleable>
				<div :class="$style.list">
					<div
						v-for="(block, ind) in formData.blocks"
						:key="`block_${ind}`"
						:class="$style.item"
					>
						<div :class="$style.itemHead">
							<span :class="$style.counter">
								{{ counter(ind) }}
							</span>
							<div :class="$style.itemActions">
								<PrimeButton
									icon="pi pi-arrow-up"
									severity="secondary"
									variant="outlined"
									:disabled="ind === 0"
									@click="move(formData.blocks, ind, -1)"
								/>
								<PrimeButton
									icon="pi pi-arrow-down"
									severity="secondary"
									variant="outlined"
									:disabled="
										ind === formData.blocks.length - 1
									"
									@click="move(formData.blocks, ind, 1)"
								/>
								<PrimeButton
									icon="pi pi-trash"
									severity="danger"
									variant="outlined"
									@click="formData.blocks.splice(ind, 1)"
								/>
							</div>
						</div>

						<div :class="$style.langGrid">
							<div
								v-for="lang in ['en', 'ru']"
								:key="`block_${ind}_${lang}`"
								:class="$style.block"
							>
								<div :class="$style.langLabel">{{ lang }}</div>
								<PrimeFloatLabel variant="on">
									<PrimeInputText
										:id="`block_${ind}_title_${lang}`"
										v-model="block[`title_${lang}`]"
									/>
									<label :for="`block_${ind}_title_${lang}`">
										Title
									</label>
								</PrimeFloatLabel>
								<PrimeFloatLabel variant="on">
									<PrimeTextarea
										:id="`block_${ind}_text_${lang}`"
										v-model="block[`text_${lang}`]"
										rows="3"
										autoResize
									/>
									<label :for="`block_${ind}_text_${lang}`">
										Text
									</label>
								</PrimeFloatLabel>
							</div>
						</div>
					</div>

					<PrimeButton
						label="Add block"
						icon="pi pi-plus"
						severity="secondary"
						@click="addBlock"
					/>
				</div>
			</PrimePanel>

			<PrimePanel header="Screenshots" toggleable>
				<div :class="$style.list">
					<div
						v-for="(shot, ind) in formData.images"
						:key="`shot_${ind}`"
						:class="$style.item"
					>
						<div :class="$style.itemHead">
							<span :class="$style.counter">
								{{ counter(ind) }}
							</span>
							<div :class="$style.itemActions">
								<PrimeButton
									icon="pi pi-arrow-up"
									severity="secondary"
									variant="outlined"
									:disabled="ind === 0"
									@click="move(formData.images, ind, -1)"
								/>
								<PrimeButton
									icon="pi pi-arrow-down"
									severity="secondary"
									variant="outlined"
									:disabled="
										ind === formData.images.length - 1
									"
									@click="move(formData.images, ind, 1)"
								/>
								<PrimeButton
									icon="pi pi-trash"
									severity="danger"
									variant="outlined"
									@click="formData.images.splice(ind, 1)"
								/>
							</div>
						</div>

						<div :class="$style.row">
							<PrimeFileUpload
								mode="basic"
								customUpload
								auto
								chooseLabel="Загрузить"
								accept="image/*"
								class="admin-input"
								@uploader="onShotChange($event, ind)"
							/>
							<NuxtImg
								v-if="shot.image"
								:src="shot.image"
								:class="$style.preview"
								alt="Project screenshot"
							/>
							<div :class="$style.row">
								<PrimeCheckbox
									:inputId="`shot_${ind}_wide`"
									size="large"
									binary
									v-model="shot.isWide"
								/>
								<label :for="`shot_${ind}_wide`">
									Full width
								</label>
							</div>
						</div>

						<div :class="$style.langGrid">
							<PrimeFloatLabel
								v-for="lang in ['en', 'ru']"
								:key="`shot_${ind}_${lang}`"
								variant="on"
							>
								<PrimeInputText
									:id="`shot_${ind}_caption_${lang}`"
									v-model="shot[`caption_${lang}`]"
								/>
								<label :for="`shot_${ind}_caption_${lang}`">
									Caption {{ lang }}
								</label>
							</PrimeFloatLabel>
						</div>
					</div>

					<PrimeButton
						label="Add screenshot"
						icon="pi pi-plus"
						severity="secondary"
						@click="addShot"
					/>
				</div>
			</PrimePanel>

			<PrimePanel header="Resource links" toggleable>
				<div :class="$style.list">
					<div
						v-for="(link, ind) in formData.links"
						:key="`link_${ind}`"
						:class="$style.item"
					>
						<div :class="$style.itemHead">
							<span :class="$style.counter">
								{{ counter(ind) }}
							</span>
							<div :class="$style.itemActions">
								<PrimeButton
									icon="pi pi-arrow-up"
									severity="secondary"
									variant="outlined"
									:disabled="ind === 0"
									@click="move(formData.links, ind, -1)"
								/>
								<PrimeButton
									icon="pi pi-arrow-down"
									severity="secondary"
									variant="outlined"
									:disabled="
										ind === formData.links.length - 1
									"
									@click="move(formData.links, ind, 1)"
								/>
								<PrimeButton
									icon="pi pi-trash"
									severity="danger"
									variant="outlined"
									@click="formData.links.splice(ind, 1)"
								/>
							</div>
						</div>

						<div :class="$style.langGrid">
							<PrimeFloatLabel
								v-for="lang in ['en', 'ru']"
								:key="`link_${ind}_${lang}`"
								variant="on"
							>
								<PrimeInputText
									:id="`link_${ind}_label_${lang}`"
									v-model="link[`label_${lang}`]"
								/>
								<label :for="`link_${ind}_label_${lang}`">
									Label {{ lang }}
								</label>
							</PrimeFloatLabel>
						</div>

						<PrimeFloatLabel variant="on">
							<PrimeInputText
								:id="`link_${ind}_url`"
								v-model="link.url"
							/>
							<label :for="`link_${ind}_url`">URL</label>
						</PrimeFloatLabel>
					</div>

					<PrimeButton
						label="Add link"
						icon="pi pi-plus"
						severity="secondary"
						@click="addLink"
					/>
				</div>
			</PrimePanel>

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

.detailSwitch {
	margin-bottom: 2.4rem;
}

.langGrid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 2.4rem;

	:global(.p-floatlabel),
	:global(.p-inputtext),
	:global(.p-textarea) {
		width: 100%;
	}

	@include media($tablet) {
		grid-template-columns: 1fr;
	}
}

.langLabel {
	font-size: 1.1rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: $gray4;
}

.list {
	display: grid;
	gap: 2rem;
	justify-items: start;
}

.item {
	display: grid;
	gap: 2rem;
	width: 100%;
	padding: 2rem;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 0.8rem;
}

.itemHead {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 2rem;
}

.counter {
	font-size: 1.2rem;
	letter-spacing: 0.16em;
	color: $gray4;
}

.itemActions {
	display: flex;
	gap: 0.8rem;
}
</style>

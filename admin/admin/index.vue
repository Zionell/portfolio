<script setup lang="ts">
import type { HomeExperience, HomeSkill } from "~~/generated/prisma/client";
import type { ITab } from "#shared/types/admin.types";

definePageMeta({
	layout: "admin",
});

const tabs: ITab[] = [
	{ id: "hero", label: "Hero" },
	{ id: "about", label: "About" },
	{ id: "experience", label: "Experience" },
	{ id: "skills", label: "Skills" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const activeTab = ref<TabId>("hero");

const skillUploading = ref<number | null>(null);
const skillUploadError = ref<Record<number, string>>({});
const responsibilitiesHtml = ref<Record<number, string>>({});

const experienceForm = ref<HomeExperience[]>([]);
const skillsForm = ref<HomeSkill[]>([]);

const addExperience = () => {
	experienceForm.value.push({
		company: "",
		position: "",
		period: "",
		stack: [],
		responsibilities: [],
	});
};

const removeExperience = (index: number) => {
	experienceForm.value.splice(index, 1);
};

const addSkill = () => {
	skillsForm.value.push({ icon: "", label: "" });
};

const removeSkill = (index: number) => {
	skillsForm.value.splice(index, 1);
};

const onSkillIconChange = async (index: number, event: any) => {
	const file = resolveFile(event);
	if (!file) return;
	try {
		skillUploading.value = index;
		skillUploadError.value = { ...skillUploadError.value, [index]: "" };
		const content = await file.text();
		// skillsForm.value[index].icon = content;
	} catch (error) {
		skillUploadError.value = {
			...skillUploadError.value,
			[index]: "Не удалось загрузить иконку.",
		};
	} finally {
		skillUploading.value = null;
	}
};

const handleSave = async () => {
	if (activeTab.value === "hero") {
	} else if (activeTab.value === "about") {
	} else if (activeTab.value === "experience") {
		await $fetch("/api/v1/admin/experience", {
			method: "POST",
			body: {
				items: experienceForm.value,
			},
		});
	} else if (activeTab.value === "skills") {
		await $fetch("/api/v1/admin/skills", {
			method: "POST",
			body: {
				items: skillsForm.value,
			},
		});
	}
};
</script>

<template>
	<section :class="$style.AdminSection">
		<AdminHeader
			:tabs="tabs"
			:active-tab="activeTab"
			@change-tab="activeTab = $event"
		/>

		<AdminHero v-if="activeTab === 'hero'" />

		<AdminAbout v-if="activeTab === 'about'" />

		<div v-if="activeTab === 'experience'">
			<div
				v-for="(item, index) in experienceForm"
				:key="`exp-${index}`"
				:class="$style.card"
			>
				<div :class="$style.cardHeader">
					<p :class="$style.cardTitle">Запись {{ index + 1 }}</p>
					<Button
						:class="$style.removeBtn"
						label="Удалить"
						@click="removeExperience(index)"
					/>
				</div>
				<div class="admin-row">
					<label class="admin-field">
						<span>Компания</span>
						<InputText v-model="item.company" class="admin-input" />
					</label>
					<label class="admin-field">
						<span>Должность</span>
						<InputText
							v-model="item.position"
							class="admin-input"
						/>
					</label>
				</div>
				<div class="admin-row">
					<label class="admin-field">
						<span>Период</span>
						<InputText v-model="item.period" class="admin-input" />
					</label>
					<label class="admin-field">
						<span>Стек (через запятую)</span>
						<InputText
							class="admin-input"
							:modelValue="item.stack.join(', ')"
							@update:modelValue="
								item.stack = ($event || '')
									.split(',')
									.map((v: string) => v.trim())
									.filter(Boolean)
							"
						/>
					</label>
				</div>
				<label class="admin-field">
					<span>Ответственности (через строку)</span>
					<ClientOnly>
						<Editor
							:class="$style.editor"
							editorStyle="height: 180px"
							v-model="responsibilitiesHtml[index]"
						/>
						<template #fallback>
							<div class="admin-helper">
								Редактор загружается...
							</div>
						</template>
					</ClientOnly>
				</label>
			</div>
			<Button
				:class="['admin-button']"
				label="Добавить опыт"
				@click="addExperience"
			/>
		</div>

		<div v-if="activeTab === 'skills'">
			<div
				v-for="(skill, index) in skillsForm"
				:key="`skill-${index}`"
				:class="$style.card"
			>
				<div :class="$style.cardHeader">
					<p :class="$style.cardTitle">Скилл {{ index + 1 }}</p>
					<Button
						:class="$style.removeBtn"
						label="Удалить"
						@click="removeSkill(index)"
					/>
				</div>
				<div class="admin-row">
					<label class="admin-field">
						<span>Название</span>
						<InputText v-model="skill.label" class="admin-input" />
					</label>
					<label class="admin-field">
						<span>Иконка</span>
						<ClientOnly>
							<FileUpload
								mode="basic"
								customUpload
								auto
								chooseLabel="Загрузить SVG"
								accept="image/svg+xml"
								class="admin-input"
								@uploader="onSkillIconChange(index, $event)"
							/>
							<template #fallback>
								<div class="admin-helper">
									Загрузка формы...
								</div>
							</template>
						</ClientOnly>
						<small v-if="skill.icon" class="admin-helper"
							>SVG загружен</small
						>
						<small
							v-if="skillUploading === index"
							class="admin-helper"
							>Загрузка...</small
						>
						<small
							v-if="skillUploadError[index]"
							class="admin-error"
						>
							{{ skillUploadError[index] }}
						</small>
					</label>
				</div>
			</div>
			<Button
				:class="['admin-button']"
				label="Добавить скилл"
				@click="addSkill"
			/>
		</div>
	</section>
</template>

<style lang="scss" module>
.AdminSection {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.list {
	display: grid;
	gap: 1.6rem;
}

.listItem {
	border: 1px solid rgba(255, 255, 255, 0.08);
	padding: 1.6rem;
	background: rgba(255, 255, 255, 0.02);
}

.card {
	border: 1px solid rgba(255, 255, 255, 0.08);
	padding: 1.6rem;
	background: rgba(255, 255, 255, 0.02);
	display: grid;
	gap: 1.6rem;
}

.cardHeader {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.6rem;
}

.cardTitle {
	font-size: 1.2rem;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: $gray4;
}

.removeBtn {
	border: 1px solid rgba(255, 255, 255, 0.16);
	background: transparent;
	color: $gray4;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	font-size: 1.1rem;
	padding: 0.5rem 1.2rem;
	transition: $default-transition;
}

.removeBtn:hover {
	color: $white;
	border-color: rgba(255, 255, 255, 0.4);
}
</style>

<script setup lang="ts">
import type { ISettings } from "#shared/types/settings.types";
import { api } from "~/assets/data/api";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Editor from "primevue/editor";

definePageMeta({
	layout: "admin",
});

const { data, refresh } = await useFetch<ISettings>(api.settings);

const form = reactive<ISettings>({
	contacts: {
		email: "",
		phone: "",
		social: [],
	},
	seo: {
		title: "",
		description: "",
		link: "",
		image: "",
		author: "",
	},
	meta: [],
	links: [],
	scripts: {
		scripts: [],
		noScripts: [],
	},
});

const isSaving = ref(false);
const saveError = ref("");
const saveSuccess = ref("");

const applySettings = (value?: ISettings) => {
	form.contacts.email = value?.contacts?.email || "";
	form.contacts.phone = value?.contacts?.phone || "";
	form.contacts.social = value?.contacts?.social
		? value.contacts.social.map((item) => ({ ...item }))
		: [];
	form.seo = {
		title: value?.seo?.title || "",
		description: value?.seo?.description || "",
		link: value?.seo?.link || "",
		image: value?.seo?.image || "",
		author: value?.seo?.author || "",
	};
	form.meta = value?.meta ? value.meta.map((item) => ({ ...item })) : [];
	form.links = value?.links ? value.links.map((item) => ({ ...item })) : [];
	form.scripts = {
		scripts: value?.scripts?.scripts
			? value.scripts.scripts.map((item) => ({ ...item }))
			: [],
		noScripts: value?.scripts?.noScripts
			? value.scripts.noScripts.map((item) => ({ ...item }))
			: [],
	};
};

watch(
	() => data.value,
	(value) => applySettings(value),
	{ immediate: true },
);

const addSocial = () => {
	form.contacts.social = form.contacts.social || [];
	form.contacts.social.push({ name: "", icon: "", link: "" });
};

const removeSocial = (index: number) => {
	form.contacts.social?.splice(index, 1);
};

const addMeta = () => {
	form.meta = form.meta || [];
	form.meta.push({ name: "", content: "", hid: "" });
};

const removeMeta = (index: number) => {
	form.meta?.splice(index, 1);
};

const addLink = () => {
	form.links = form.links || [];
	form.links.push({ rel: "", href: "", sizes: "", type: "" });
};

const removeLink = (index: number) => {
	form.links?.splice(index, 1);
};

const addScript = () => {
	form.scripts = form.scripts || { scripts: [], noScripts: [] };
	form.scripts.scripts.push({ src: "", innerHTML: "", async: false });
};

const removeScript = (index: number) => {
	form.scripts?.scripts.splice(index, 1);
};

const addNoScript = () => {
	form.scripts = form.scripts || { scripts: [], noScripts: [] };
	form.scripts.noScripts.push({ innerHTML: "", body: true });
};

const removeNoScript = (index: number) => {
	form.scripts?.noScripts.splice(index, 1);
};

const saveSettings = async () => {
	saveError.value = "";
	saveSuccess.value = "";
	isSaving.value = true;
	try {
		await $fetch("/api/v1/admin/settings", {
			method: "POST",
			body: form,
		});
		saveSuccess.value = "Сохранено.";
		await refresh();
	} catch (error) {
		saveError.value = "Не удалось сохранить настройки.";
	} finally {
		isSaving.value = false;
	}
};
</script>

<template>
	<section class="admin-section">
		<header class="admin-header">
			<div>
				<h1 class="admin-title">Settings</h1>
				<p class="admin-subtitle">Контакты, SEO, Meta, Links и Scripts.</p>
			</div>
			<div class="admin-actions">
				<Button
					class="admin-button"
					label="Сохранить"
					type="button"
					:loading="isSaving"
					@click="saveSettings"
				/>
			</div>
		</header>

		<div class="admin-form">
			<section class="admin-card">
				<h3>Contacts</h3>
				<div class="admin-row">
					<label class="admin-field">
						<span>Email</span>
						<InputText v-model="form.contacts.email" class="admin-input" />
					</label>
					<label class="admin-field">
						<span>Phone</span>
						<InputText v-model="form.contacts.phone" class="admin-input" />
					</label>
				</div>

				<div class="admin-field">
					<span>Social</span>
					<div class="admin-list">
						<div
							v-for="(item, index) in form.contacts.social"
							:key="`${item.name}-${index}`"
							class="admin-card"
						>
							<div class="admin-row">
								<label class="admin-field">
									<span>Name</span>
									<InputText v-model="item.name" class="admin-input" />
								</label>
								<label class="admin-field">
									<span>Icon</span>
									<InputText v-model="item.icon" class="admin-input" />
								</label>
							</div>
							<label class="admin-field">
								<span>Link</span>
								<InputText v-model="item.link" class="admin-input" />
							</label>
							<Button
								class="admin-button"
								label="Удалить"
								type="button"
								@click="removeSocial(index)"
							/>
						</div>
					</div>
					<Button
						class="admin-button"
						label="Добавить соцсеть"
						type="button"
						@click="addSocial"
					/>
				</div>
			</section>

			<section class="admin-card">
				<h3>SEO</h3>
				<label class="admin-field">
					<span>Title</span>
					<InputText v-model="form.seo.title" class="admin-input" />
				</label>
				<label class="admin-field">
					<span>Description</span>
					<InputText v-model="form.seo.description" class="admin-input" />
				</label>
				<div class="admin-row">
					<label class="admin-field">
						<span>Link</span>
						<InputText v-model="form.seo.link" class="admin-input" />
					</label>
					<label class="admin-field">
						<span>Image</span>
						<InputText v-model="form.seo.image" class="admin-input" />
					</label>
				</div>
				<label class="admin-field">
					<span>Author</span>
					<InputText v-model="form.seo.author" class="admin-input" />
				</label>
			</section>

			<section class="admin-card">
				<h3>Meta</h3>
				<div class="admin-list">
					<div
						v-for="(item, index) in form.meta"
						:key="`${item.name}-${index}`"
						class="admin-card"
					>
						<div class="admin-row">
							<label class="admin-field">
								<span>Name</span>
								<InputText v-model="item.name" class="admin-input" />
							</label>
							<label class="admin-field">
								<span>Hid</span>
								<InputText v-model="item.hid" class="admin-input" />
							</label>
						</div>
						<label class="admin-field">
							<span>Content</span>
							<InputText v-model="item.content" class="admin-input" />
						</label>
						<Button
							class="admin-button"
							label="Удалить"
							type="button"
							@click="removeMeta(index)"
						/>
					</div>
				</div>
				<Button class="admin-button" label="Добавить meta" type="button" @click="addMeta" />
			</section>

			<section class="admin-card">
				<h3>Links</h3>
				<div class="admin-list">
					<div
						v-for="(item, index) in form.links"
						:key="`${item.rel}-${index}`"
						class="admin-card"
					>
						<div class="admin-row">
							<label class="admin-field">
								<span>Rel</span>
								<InputText v-model="item.rel" class="admin-input" />
							</label>
							<label class="admin-field">
								<span>Href</span>
								<InputText v-model="item.href" class="admin-input" />
							</label>
						</div>
						<div class="admin-row">
							<label class="admin-field">
								<span>Sizes</span>
								<InputText v-model="item.sizes" class="admin-input" />
							</label>
							<label class="admin-field">
								<span>Type</span>
								<InputText v-model="item.type" class="admin-input" />
							</label>
						</div>
						<Button
							class="admin-button"
							label="Удалить"
							type="button"
							@click="removeLink(index)"
						/>
					</div>
				</div>
				<Button class="admin-button" label="Добавить link" type="button" @click="addLink" />
			</section>

			<section class="admin-card">
				<h3>Scripts</h3>
				<div class="admin-list">
					<div
						v-for="(item, index) in form.scripts?.scripts"
						:key="`script-${index}`"
						class="admin-card"
					>
						<label class="admin-field">
							<span>Src</span>
							<InputText v-model="item.src" class="admin-input" />
						</label>
						<label class="admin-field">
							<span>Inline</span>
							<ClientOnly>
								<Editor v-model="item.innerHTML" editorStyle="height: 160px" />
								<template #fallback>
									<div class="admin-helper">Редактор загружается...</div>
								</template>
							</ClientOnly>
						</label>
						<label class="admin-field">
							<span>Async</span>
							<Checkbox v-model="item.async" binary />
						</label>
						<Button
							class="admin-button"
							label="Удалить"
							type="button"
							@click="removeScript(index)"
						/>
					</div>
				</div>
				<Button
					class="admin-button"
					label="Добавить script"
					type="button"
					@click="addScript"
				/>
			</section>

			<section class="admin-card">
				<h3>NoScript</h3>
				<div class="admin-list">
					<div
						v-for="(item, index) in form.scripts?.noScripts"
						:key="`noscript-${index}`"
						class="admin-card"
					>
						<label class="admin-field">
							<span>Inline</span>
							<ClientOnly>
								<Editor v-model="item.innerHTML" editorStyle="height: 160px" />
								<template #fallback>
									<div class="admin-helper">Редактор загружается...</div>
								</template>
							</ClientOnly>
						</label>
						<label class="admin-field">
							<span>Body</span>
							<Checkbox v-model="item.body" binary />
						</label>
						<Button
							class="admin-button"
							label="Удалить"
							type="button"
							@click="removeNoScript(index)"
						/>
					</div>
				</div>
				<Button
					class="admin-button"
					label="Добавить noscript"
					type="button"
					@click="addNoScript"
				/>
			</section>

			<small v-if="saveSuccess" class="admin-helper">{{ saveSuccess }}</small>
			<small v-if="saveError" class="admin-error">{{ saveError }}</small>
		</div>
	</section>
</template>

<style lang="scss" module>
.admin-list {
	display: grid;
	gap: 1.2rem;
}

h3 {
	font-size: 1.4rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}
</style>

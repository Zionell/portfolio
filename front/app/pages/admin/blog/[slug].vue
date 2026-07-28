<script setup lang="ts">
import { api } from "~/assets/data/api";
import { useAdminUpload } from "~/composables/useAdminUpload";
import { resolveFile, slugify } from "~/assets/ts/utils";
import type { PostSkeleton } from "~~/generated/prisma/client";
import type {
	IFormDataPost,
	IPostAdmin,
	IResponsePostAdmin,
} from "#shared/types/blog.types";
import AdminSectionFooter from "~/components/admin/common/AdminSectionFooter.vue";

definePageMeta({
	layout: "admin",
});

type BlockKind = "text" | "image";

interface IEditorBlock {
	uid: string;
	kind: BlockKind;
	text: string;
	image: string;
}

const TYPES: string[] = ["Post", "News"];

const route = useRoute();
const id = useId();
const { uploadFile } = useAdminUpload();
const { locales, locale } = useI18n();

const postId = computed(() => String(route.params.slug || ""));
const isNew = computed(() => postId.value === "new");
const skeletonId = computed(() =>
	route.query.skeletonId ? String(route.query.skeletonId) : null,
);

const formData = ref<IFormDataPost>({
	slug: "",
	title: "",
	excerpt: "",
	readTime: 1,
	cover: "",
	lang: locale.value,
	mainPage: false,
	isPublished: false,
	type: "",
	content: [],
});

const blocks = ref<IEditorBlock[]>([]);
const isSlugTouched = ref(false);
const isSaving = ref(false);
const isUploading = ref(false);
const saveError = ref("");
const saveMessage = ref("");

const createBlock = (kind: BlockKind, text = ""): IEditorBlock => ({
	uid: id,
	kind,
	text,
	image: "",
});

const { data, error: fetchError } = await useAsyncData<IResponsePostAdmin>(
	() => `admin-post-${postId.value}-${skeletonId.value || ""}`,
	async () => {
		const [post, skeleton] = await Promise.all([
			isNew.value
				? null
				: $fetch<IPostAdmin>(`${api.admin.blog}/${postId.value}`),
			skeletonId.value
				? $fetch<PostSkeleton>(
						`${api.admin.skeleton}/${skeletonId.value}`,
					)
				: null,
		]);

		return { post, skeleton };
	},
);

if (data.value) {
	const post = data.value?.post;

	if (post) {
		formData.value = {
			id: post.id,
			slug: post.slug,
			title: post.title,
			excerpt: post.excerpt,
			readTime: post.readTime,
			cover: post.cover || "",
			lang: post.lang,
			mainPage: post.mainPage,
			isPublished: post.isPublished,
			type: post.type,
			content: [],
		};

		blocks.value = post.content.map(
			(item): IEditorBlock => ({
				uid: item.id,
				kind: item.image ? "image" : "text",
				text: item.text || "",
				image: item.image || "",
			}),
		);
	}

	// Новый пост: без скелета остаётся пустая форма с одним текстовым блоком
	const skeleton = data.value?.skeleton;

	if (skeleton) {
		formData.value.title = skeleton.title;
		formData.value.slug = slugify(skeleton.title);

		blocks.value = [createBlock("text", skeleton.body || "")];

		if (skeleton.commits) {
			blocks.value.push(
				createBlock("text", `<pre>${skeleton.commits}</pre>`),
			);
		}
	}

	if (!blocks.value.length) {
		blocks.value = [createBlock("text")];
	}
}

const coverPreview = computed(() => formData.value.cover);

const isValid = computed(
	() =>
		Boolean(formData.value.title.trim()) &&
		Boolean(formData.value.slug.trim()),
);

watch(
	() => formData.value.title,
	(title) => {
		if (!isNew.value || isSlugTouched.value) return;

		formData.value.slug = slugify(title);
	},
);

const moveBlock = (index: number, direction: -1 | 1) => {
	const target = index + direction;

	if (target < 0 || target >= blocks.value.length) return;

	const list = blocks.value;
	const [item] = list.splice(index, 1);

	if (item) list.splice(target, 0, item);
};

const removeBlock = (index: number) => {
	blocks.value.splice(index, 1);
};

const addBlock = (kind: BlockKind) => {
	blocks.value.push(createBlock(kind));
};

const onCoverChange = async (event: any) => {
	const file = resolveFile(event);
	if (!file) return;

	isUploading.value = true;

	try {
		formData.value.cover = await uploadFile(file, "blog");
	} catch (error) {
		saveError.value = "Failed to upload the cover.";
	} finally {
		isUploading.value = false;
	}
};

const onBlockImageChange = async (event: any, block: IEditorBlock) => {
	const file = resolveFile(event);
	if (!file) return;

	isUploading.value = true;

	try {
		block.image = await uploadFile(file, "blog");
	} catch (error) {
		saveError.value = "Failed to upload the image.";
	} finally {
		isUploading.value = false;
	}
};

const estimateReadTime = () => {
	const text = blocks.value
		.filter((block) => block.kind === "text")
		.map((block) => block.text)
		.concat(formData.value.excerpt)
		.join(" ")
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ");

	const words = text.split(/\s+/).filter(Boolean).length;

	formData.value.readTime = Math.max(1, Math.round(words / 200));
};

const handleSave = async () => {
	saveError.value = "";
	saveMessage.value = "";

	if (!isValid.value) {
		saveError.value = "Title, slug and type are required.";
		return;
	}

	isSaving.value = true;

	try {
		const payload: IFormDataPost = {
			...formData.value,
			slug: formData.value.slug.trim(),
			title: formData.value.title.trim(),
			content: blocks.value.map((block, index) => ({
				text:
					block.kind === "text"
						? block.text.replace(/&nbsp;/g, " ")
						: null,
				image: block.kind === "image" ? block.image : null,
				order: index,
			})),
			skeletonId: skeletonId.value,
		};

		const post = await $fetch<IPostAdmin>(api.admin.blog, {
			method: isNew.value ? "POST" : "PATCH",
			body: payload,
		});

		if (isNew.value) {
			await navigateTo(`/admin/blog/${post.id}`);
			return;
		}

		saveMessage.value = "Saved.";
	} catch (error: any) {
		saveError.value =
			error?.data?.statusMessage || error?.message || "Failed to save.";
	} finally {
		isSaving.value = false;
	}
};
</script>

<template>
	<section :class="$style.AdminSection">
		<AdminHeader
			:title="isNew ? 'New post' : formData.title || 'Edit post'"
			:description="isNew ? '' : `/blog/${formData.slug}`"
		>
			<div :class="$style.headerActions">
				<PrimeButton
					label="Back to list"
					severity="secondary"
					variant="outlined"
					@click="navigateTo('/admin/blog')"
				/>
				<PrimeTag
					:severity="formData.isPublished ? 'success' : 'warn'"
					:value="formData.isPublished ? 'Published' : 'Draft'"
				/>
			</div>
		</AdminHeader>

		<PrimeMessage
			v-if="fetchError"
			severity="error"
			:class="$style.message"
		>
			Post not found.
		</PrimeMessage>

		<div v-else :class="$style.form">
			<PrimeMessage
				v-if="saveError"
				severity="error"
				:class="$style.message"
			>
				{{ saveError }}
			</PrimeMessage>
			<PrimeMessage
				v-if="saveMessage"
				severity="success"
				:class="$style.message"
			>
				{{ saveMessage }}
			</PrimeMessage>

			<PrimePanel header="Main" toggleable>
				<div :class="$style.grid">
					<PrimeFloatLabel variant="on">
						<PrimeInputText
							id="title"
							v-model="formData.title"
							fluid
							:invalid="!formData.title.trim()"
						/>
						<label for="title">Title</label>
					</PrimeFloatLabel>

					<PrimeFloatLabel variant="on">
						<PrimeInputText
							id="slug"
							v-model="formData.slug"
							fluid
							:invalid="!formData.slug.trim()"
							@input="isSlugTouched = true"
						/>
						<label for="slug">Slug</label>
					</PrimeFloatLabel>

					<PrimeFloatLabel variant="on">
						<PrimeSelect
							id="type"
							v-model="formData.type"
							:options="TYPES"
							:invalid="!formData.type"
							fluid
						/>
						<label for="type">Type</label>
					</PrimeFloatLabel>

					<div :class="$style.inline">
						<PrimeFloatLabel variant="on" :class="$style.grow">
							<PrimeInputNumber
								id="readTime"
								v-model="formData.readTime"
								:min="1"
								show-buttons
								button-layout="horizontal"
								fluid
							>
								<template #incrementbuttonicon>
									<span class="pi pi-plus" />
								</template>
								<template #decrementbuttonicon>
									<span class="pi pi-minus" />
								</template>
							</PrimeInputNumber>
							<label for="readTime">Read time, min</label>
						</PrimeFloatLabel>
						<PrimeButton
							label="Estimate"
							severity="secondary"
							variant="outlined"
							@click="estimateReadTime"
						/>
					</div>
				</div>

				<div :class="$style.excerpt">
					<PrimeFloatLabel variant="on">
						<PrimeTextarea
							id="excerpt"
							v-model="formData.excerpt"
							rows="3"
							auto-resize
							fluid
						/>
						<label for="excerpt">Excerpt</label>
					</PrimeFloatLabel>
				</div>

				<div :class="$style.toggles">
					<div :class="$style.toggle">
						<PrimeToggleSwitch
							input-id="mainPage"
							v-model="formData.mainPage"
						/>
						<label for="mainPage">Show on main page</label>
					</div>
					<PrimeSelectButton
						v-model="formData.lang"
						:options="locales"
						option-label="name"
						option-value="code"
						:allow-empty="false"
					/>
				</div>
			</PrimePanel>

			<PrimePanel header="Cover" toggleable>
				<div :class="$style.inline">
					<PrimeFileUpload
						mode="basic"
						custom-upload
						auto
						choose-label="Upload"
						accept="image/*"
						@uploader="onCoverChange"
					/>
					<PrimeButton
						v-if="formData.cover"
						label="Remove"
						severity="danger"
						variant="outlined"
						@click="formData.cover = ''"
					/>
					<PrimeProgressSpinner
						v-if="isUploading"
						:class="$style.spinner"
						stroke-width="6"
					/>
					<NuxtImg
						v-if="coverPreview"
						:src="coverPreview"
						:class="$style.preview"
						alt="Post cover"
					/>
				</div>
			</PrimePanel>

			<PrimePanel header="Content" toggleable>
				<div :class="$style.blocks">
					<div
						v-for="(block, index) in blocks"
						:key="block.uid"
						:class="$style.block"
					>
						<div :class="$style.blockHead">
							<PrimeTag
								:value="block.kind"
								severity="secondary"
							/>
							<span :class="$style.blockOrder">
								#{{ index + 1 }}
							</span>
							<div :class="$style.blockActions">
								<PrimeButton
									icon="pi pi-arrow-up"
									severity="secondary"
									variant="text"
									:disabled="index === 0"
									aria-label="Move up"
									@click="moveBlock(index, -1)"
								/>
								<PrimeButton
									icon="pi pi-arrow-down"
									severity="secondary"
									variant="text"
									:disabled="index === blocks.length - 1"
									aria-label="Move down"
									@click="moveBlock(index, 1)"
								/>
								<PrimeButton
									icon="pi pi-trash"
									severity="danger"
									variant="text"
									aria-label="Remove block"
									@click="removeBlock(index)"
								/>
							</div>
						</div>

						<ClientOnly v-if="block.kind === 'text'">
							<PrimeEditor
								v-model="block.text"
								editor-style="height: 28rem"
							/>
							<template #fallback>
								<PrimeSkeleton height="28rem" />
							</template>
						</ClientOnly>

						<div v-else :class="$style.inline">
							<PrimeFileUpload
								mode="basic"
								custom-upload
								auto
								choose-label="Upload"
								accept="image/*"
								@uploader="onBlockImageChange($event, block)"
							/>
							<PrimeInputText
								v-model="block.image"
								placeholder="Image URL"
								:class="$style.grow"
							/>
							<NuxtImg
								v-if="block.image"
								:src="block.image"
								:class="$style.preview"
								alt="Content image"
							/>
						</div>
					</div>

					<div v-if="!blocks.length" :class="$style.empty">
						No content blocks yet
					</div>

					<div :class="$style.inline">
						<PrimeButton
							icon="pi pi-align-left"
							label="Add text"
							severity="secondary"
							variant="outlined"
							@click="addBlock('text')"
						/>
						<PrimeButton
							icon="pi pi-image"
							label="Add image"
							severity="secondary"
							variant="outlined"
							@click="addBlock('image')"
						/>
					</div>
				</div>
			</PrimePanel>

			<AdminSectionFooter :is-saving="isSaving" @save="handleSave">
				<div :class="$style.toggle">
					<PrimeToggleSwitch
						input-id="isPublished"
						v-model="formData.isPublished"
					/>
					<label for="isPublished">Published</label>
				</div>
			</AdminSectionFooter>
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

.headerActions {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.form {
	display: grid;
	gap: 2.4rem;
	padding: 1.6rem 0 3.2rem;
}

.message {
	margin: 0;
}

.grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(28rem, 1fr));
	gap: 2.4rem;
}

.excerpt {
	padding-top: 2.4rem;
}

.inline {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 1.2rem;
}

.grow {
	flex: 1;
	min-width: 20rem;
}

.toggles {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 2.4rem;
	padding-top: 2.4rem;
}

.toggle {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.blocks {
	display: grid;
	gap: 2rem;
}

.block {
	display: grid;
	gap: 1.2rem;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 0.8rem;
	padding: 1.6rem;
}

.blockHead {
	display: flex;
	align-items: center;
	gap: 1.2rem;
}

.blockOrder {
	color: $gray4;
	font-size: 1.2rem;
}

.blockActions {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	margin-left: auto;
}

.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 12vh;
	color: $gray4;
}

.preview {
	width: 20rem;
	height: 10rem;
	object-fit: cover;
	border-radius: 0.6rem;
}

.spinner {
	width: 2.4rem;
	height: 2.4rem;
}
</style>

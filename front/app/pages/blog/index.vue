<script setup lang="ts">
import { blog } from "~/assets/data/blog";
import { api } from "~/assets/data/api";
import type { BlogPost } from "~~/generated/prisma/client";

const activeType = ref<string>("All");
const activeProject = ref<string>("All projects");
const projectOpen = ref(false);
const pageSize = 6;
const currentPage = ref(1);

const {data: posts} = await useFetch<BlogPost[]>(api.blog)

const typeTabs = ["All", "Post", "News", "Article"];

const projectTags = computed(() => {
	const types = new Set(typeTabs);
	const tags = new Set<string>();
	blog.forEach((post) => {
		post.tags.forEach((tag) => {
			if (!types.has(tag)) {
				tags.add(tag);
			}
		});
	});
	return ["All projects", ...tags];
});

const hasProjectTags = computed(() => projectTags.value.length > 1);

const formatDate = (value: string): string => {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
};

const filteredPosts = computed(() => {
	return blog.filter((post) => {
		const typeOk =
			activeType.value === "All" || post.tags.includes(activeType.value);
		const projectOk =
			activeProject.value === "All projects" ||
			post.tags.includes(activeProject.value);
		return typeOk && projectOk;
	});
});

const totalPages = computed(() =>
	Math.max(1, Math.ceil(filteredPosts.value.length / pageSize)),
);

const pagedPosts = computed(() => {
	const start = (currentPage.value - 1) * pageSize;
	return filteredPosts.value.slice(start, start + pageSize);
});

watch([activeType, activeProject], () => {
	currentPage.value = 1;
});

watch(filteredPosts, () => {
	if (currentPage.value > totalPages.value) {
		currentPage.value = 1;
	}
});

watch(activeProject, () => {
	projectOpen.value = false;
});
</script>

<template>
	<main :class="$style.BlogPage">
		<section :class="$style.section">
			<header :class="$style.header">
				<h1 :class="$style.title">Blog</h1>
				<span :class="$style.rule" />
			</header>

			<div :class="$style.filterGroup">
				<div :class="$style.filterBlock">
					<p :class="$style.filterLabel">Type</p>
					<div :class="$style.typeTabs">
						<HomeTagFilter
							:tags="typeTabs"
							:active="activeType"
							@update:active="activeType = $event"
						/>
					</div>
				</div>
				<div v-if="hasProjectTags" :class="$style.filterBlock">
					<p :class="$style.filterLabel">Project</p>
					<div
						:class="[
							$style.selectWrap,
							{ [$style._open]: projectOpen },
						]"
						@keydown.esc="projectOpen = false"
					>
						<button
							:class="$style.selectTrigger"
							type="button"
							aria-haspopup="listbox"
							:aria-expanded="projectOpen"
							@click="projectOpen = !projectOpen"
						>
							<span>{{ activeProject }}</span>
							<span :class="$style.selectIcon">▾</span>
						</button>
						<div
							v-if="projectOpen"
							:class="$style.selectMenu"
							role="listbox"
						>
							<button
								v-for="tag in projectTags"
								:key="tag"
								:class="[
									$style.selectItem,
									{ [$style._active]: tag === activeProject },
								]"
								type="button"
								role="option"
								@click="
									activeProject = tag;
									projectOpen = false;
								"
							>
								{{ tag }}
							</button>
						</div>
					</div>
				</div>
			</div>

			<div :class="$style.grid">
				<BlogCard
					v-for="post in posts"
					:key="post.id"
					:post="post"
					:class="$style.card"
				/>
			</div>

			<div :class="$style.pagination">
				<BlogPagination
					:page="currentPage"
					:total="filteredPosts.length"
					:per-page="pageSize"
					@update:page="currentPage = $event"
				/>
			</div>
		</section>
	</main>
</template>

<style lang="scss" module>
.BlogPage {
	display: flex;
	flex-direction: column;
	background: #000;
	color: $white;
}

.section {
	display: flex;
	flex-direction: column;
	gap: 3.2rem;
	padding: 14rem 6rem 10rem;

	@include media($mobile) {
		padding: 6rem 2.4rem 8rem;
	}
}

.header {
	display: flex;
	align-items: center;
	gap: 2.4rem;
}

.title {
	font-family: $ff-title;
	font-size: 4.2rem;
	text-transform: uppercase;
}

.rule {
	height: 1px;
	flex: 1;
	background: rgba(255, 255, 255, 0.12);
}

.filterGroup {
	display: flex;
	gap: 2.4rem;
	padding: 2rem 0;
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.filterBlock {
	display: grid;
	gap: 1.2rem;
}

.filterLabel {
	font-size: 1.1rem;
	letter-spacing: 0.3em;
	text-transform: uppercase;
	color: $gray4;
}

.typeTabs {
	display: inline-flex;
	max-width: 52rem;
}

.selectWrap {
	position: relative;
	display: inline-flex;
	align-items: center;
	width: 24rem;
	max-width: 100%;
}

.selectTrigger {
	width: 100%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 1.2rem;
	background: rgba(255, 255, 255, 0.04);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 0;
	padding: 0.8rem 3.2rem 0.8rem 1.6rem;
	color: $white;
	font-size: 1.2rem;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	transition: $default-transition;
	position: relative;
}

.selectTrigger span:first-child {
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: center;
}

.selectIcon {
	color: $gray4;
	transition: $default-transition;
	position: absolute;
	right: 1.2rem;
}

._open .selectIcon {
	transform: rotate(180deg);
}

.selectMenu {
	position: absolute;
	top: calc(100% + 0.8rem);
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.9);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 0;
	padding: 0.6rem;
	display: grid;
	gap: 0.4rem;
	z-index: 5;
	backdrop-filter: blur(12px);
}

.selectItem {
	padding: 0.8rem 1.2rem;
	border-radius: 0;
	font-size: 1.1rem;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: $gray4;
	transition: $default-transition;
	text-align: left;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	@include hover {
		background: rgba(255, 255, 255, 0.06);
		color: $white;
	}
}

.selectItem._active {
	background: rgba(255, 255, 255, 0.08);
	color: $white;
}

.filterVariants {
	display: grid;
	gap: 2.4rem;
	padding: 2rem 0;
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.variantsTitle {
	font-size: 1.1rem;
	letter-spacing: 0.3em;
	text-transform: uppercase;
	color: $gray4;
}

.grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 2rem;

	//@media #{$tablet} {
	//	grid-template-columns: repeat(2, minmax(0, 1fr));
	//}
	//
	//@media #{$mobile} {
	//	grid-template-columns: 1fr;
	//}
}

.card {
	display: grid;
	gap: 1.2rem;
	padding: 2.4rem;
	border-radius: 0;
	border: 1px solid rgba(255, 255, 255, 0.08);
	background: rgba(255, 255, 255, 0.02);
	transition: $default-transition;
	text-decoration: none;
	color: inherit;

	@include hover {
		transform: translateY(-6px);
		border-color: rgba(255, 255, 255, 0.2);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
		.cardImg {
			transform: scale(1.02);
		}
	}
}

.cardImg {
	width: 100%;
	height: 22rem;
	object-fit: cover;
	border-radius: 0;
	transition: $default-transition;
}

.meta {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.8rem;
	font-size: 1.1rem;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: $gray4;
}

.tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem;
}

.tag {
	border: 1px solid $gray3;
	border-radius: 999px;
	padding: 0.3rem 0.8rem;
	color: $gray5;
}

.dot {
	width: 0.4rem;
	height: 0.4rem;
	border-radius: 999px;
	background: $gray4;
}

.metaText {
	color: $gray4;
}

.cardTitle {
	font-size: 1.6rem;
	color: $white;
}

.cardExcerpt {
	font-size: 1.4rem;
	line-height: 1.6;
	color: $gray4;
}

.pagination {
	display: flex;
	justify-content: center;
	padding-top: 2rem;
}
</style>

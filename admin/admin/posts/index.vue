<script setup lang="ts">
import type { IHomeData } from "#shared/types/home.types";
import { api } from "~/assets/data/api";
import Button from "primevue/button";

definePageMeta({
	layout: "admin",
});

const { data } = await useFetch<IHomeData>(api.home);
const { data: skeletons } = await useFetch<{ data: Array<{ id: string; repo_name: string; title: string; body: string; commits: string }>}>("/api/v1/admin/post-skeletons");
</script>

<template>
	<section class="admin-section">
		<header class="admin-header">
			<div>
				<h1 class="admin-title">Посты</h1>
				<p class="admin-subtitle">Список постов и переход к редактированию.</p>
			</div>
			<div class="admin-actions">
				<Button class="admin-button" label="Добавить пост" type="button" />
			</div>
		</header>

		<section :class="$style.section">
			<h2 :class="$style.sectionTitle">Список постов</h2>
			<div :class="$style.list">
				<NuxtLink
					v-for="post in data?.blog || []"
					:key="post.slug"
					:to="`/admin/posts/${post.slug}`"
					:class="$style.row"
				>
					<div>
						<p :class="$style.name">{{ post.title }}</p>
						<p :class="$style.meta">{{ post.slug }}</p>
					</div>
					<p :class="$style.tags">{{ post.tags.join(" · ") }}</p>
					<p :class="$style.date">{{ post.date }}</p>
				</NuxtLink>
			</div>
		</section>

		<section :class="$style.section">
			<h2 :class="$style.sectionTitle">Post Skeletons</h2>
			<p :class="$style.sectionSubtitle">
				Скелеты из GitHub PR (PostSkeleton).
			</p>
			<div :class="$style.assetGrid">
				<div
					v-for="item in skeletons?.data || []"
					:key="item.id"
					:class="$style.assetCard"
				>
					<p :class="$style.assetRepo">{{ item.repo_name }}</p>
					<p :class="$style.assetName">{{ item.title }}</p>
					<p :class="$style.assetBody">{{ item.body }}</p>
					<p :class="$style.assetCommits">Commits: {{ item.commits }}</p>
				</div>
				<p v-if="!skeletons?.data?.length" :class="$style.assetEmpty">
					Пока нет скелетов.
				</p>
			</div>
		</section>
	</section>
</template>

<style lang="scss" module>
.section {
	display: grid;
	gap: 1.6rem;
	padding-top: 2.4rem;
	border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.sectionTitle {
	font-size: 1.6rem;
	letter-spacing: 0.16em;
	text-transform: uppercase;
}

.sectionSubtitle {
	color: $gray4;
}

.list {
	display: grid;
	gap: 1.2rem;
}

.row {
	display: grid;
	grid-template-columns: 1.6fr 1.2fr 0.6fr;
	gap: 2rem;
	align-items: center;
	padding: 1.6rem;
	border: 1px solid rgba(255, 255, 255, 0.08);
	background: rgba(255, 255, 255, 0.02);
	text-decoration: none;
	color: inherit;
	transition: $default-transition;
}

.row:hover {
	border-color: rgba(255, 255, 255, 0.24);
}

.name {
	font-size: 1.3rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.meta {
	color: $gray4;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	font-size: 1rem;
}

.tags {
	color: $gray4;
	font-size: 1.2rem;
}

.date {
	font-size: 1.1rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: $gray4;
	text-align: right;
}

.assetGrid {
	display: grid;
	gap: 1.6rem;
	margin-top: 1.6rem;
}

.assetCard {
	border: 1px solid rgba(255, 255, 255, 0.08);
	padding: 1.6rem;
	background: rgba(255, 255, 255, 0.02);
	display: grid;
	gap: 0.8rem;
}

.assetRepo {
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: $gray4;
	font-size: 1rem;
}

.assetName {
	font-size: 1.3rem;
	color: $white;
}

.assetBody {
	color: $gray4;
	line-height: 1.5;
}

.assetCommits {
	font-size: 1.1rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: $gray4;
}

.assetEmpty {
	color: $gray4;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	font-size: 1.1rem;
}
</style>

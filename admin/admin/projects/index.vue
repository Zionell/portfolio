<script setup lang="ts">
import type { IHomeData } from "#shared/types/home.types";
import { api } from "~/assets/data/api";
import Button from "primevue/button";

definePageMeta({
	layout: "admin",
});

const { data } = await useFetch<IHomeData>(api.home);

const createProject = () => {
	navigateTo("/admin/projects/new");
};
</script>

<template>
	<section class="admin-section">
		<header class="admin-header">
			<div>
				<h1 class="admin-title">Проекты</h1>
				<p class="admin-subtitle">Список проектов и переход к редактированию.</p>
			</div>
			<div class="admin-actions">
				<Button
					class="admin-button"
					label="Добавить проект"
					type="button"
					@click="createProject"
				/>
			</div>
		</header>

		<div :class="$style.list">
			<NuxtLink
				v-for="project in data?.projects || []"
				:key="project.slug"
				:to="`/admin/projects/${project.slug}`"
				:class="$style.row"
			>
				<div>
					<p :class="$style.name">{{ project.name }}</p>
					<p :class="$style.meta">{{ project.slug }}</p>
				</div>
				<p :class="$style.stack">{{ project.stack.join(" · ") }}</p>
				<p :class="$style.status">
					<span v-if="project.isDeveloping">In progress</span>
					<span v-else-if="project.isArchived">Archived</span>
					<span v-else>Active</span>
				</p>
			</NuxtLink>
		</div>
	</section>
</template>

<style lang="scss" module>
.list {
	display: grid;
	gap: 1.2rem;
}

.row {
	display: grid;
	grid-template-columns: 1.4fr 1.6fr 0.6fr;
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
	font-size: 1.4rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.meta {
	color: $gray4;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	font-size: 1rem;
}

.stack {
	color: $gray4;
	font-size: 1.2rem;
}

.status {
	font-size: 1.1rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: $gray4;
	text-align: right;
}
</style>

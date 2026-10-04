<script setup lang="ts">
import type { IPostWithProject } from "#shared/types/blog.types";

const props = defineProps<{
	post: IPostWithProject;
}>();

const { locale } = useI18n();

const formattedDate = computed(() => {
	const date = new Date(props.post.date);

	if (Number.isNaN(date.getTime())) {
		return props.post.date;
	}

	return date.toLocaleDateString(locale.value, {
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
});
</script>

<template>
	<div :class="$style.BlogMetaInfo">
		<span v-if="post.type" :class="$style.tag">
			{{ post.type }}
		</span>
		<NuxtLink
			v-if="post.project?.showDetail"
			:to="`/projects/${post.project.slug}`"
			:class="[$style.tag, $style.projectTag]"
		>
			{{ post.project.name }}
		</NuxtLink>
		<span v-else-if="post.project" :class="$style.tag">
			{{ post.project.name }}
		</span>

		<span v-if="post.type" :class="$style.dot" />
		<span v-if="props.post.date" :class="$style.date">
			{{ formattedDate }}
		</span>

		<span v-if="props.post.date" :class="$style.dot" />
		<span :class="$style.readTime">
			{{ post.readTime }} {{ $t("common.readTime") }}
		</span>
	</div>
</template>

<style module lang="scss">
.BlogMetaInfo {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 1rem;
	font-size: 1rem;
	text-transform: uppercase;
	color: $gray4;
}

.tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.8rem;
}

.tag {
	border: 1px solid $gray3;
	border-radius: 0.8rem;
	padding: 0.4rem 1.2rem;
	color: $gray5;
}

.projectTag {
	transition:
		color 0.2s,
		border-color 0.2s;

	&:hover {
		border-color: $gray5;
		color: $gray6;
	}
}

.dot {
	width: 0.4rem;
	height: 0.4rem;
	border-radius: 100%;
	background: $gray4;
}
</style>

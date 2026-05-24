<script setup lang="ts">
import type { Posts } from "~~/generated/prisma/client";

const props = defineProps<{
	post: Posts;
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
		<ul v-if="post.tags.length" :class="$style.tags">
			<li v-for="tag in post.tags" :key="tag" :class="$style.tag">
				{{ tag }}
			</li>
		</ul>

		<span v-if="post.tags.length" :class="$style.dot" />
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

.dot {
	width: 0.4rem;
	height: 0.4rem;
	border-radius: 100%;
	background: $gray4;
}
</style>

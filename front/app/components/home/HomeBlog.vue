<script setup lang="ts">
import type { Posts } from "~~/generated/prisma/client";

const props = defineProps<{
	content: Posts[];
}>();
</script>

<template>
	<TheSectionWrapper class="container" :title="$t('sections.blog')">
		<template #header>
			<NuxtLink :class="$style.more" to="/blog">
				{{ $t("common.viewAll") }}
			</NuxtLink>
		</template>

		<div :class="$style.HomeBlog">
			<BlogCard
				v-for="post in props.content"
				:key="post.id"
				:post="post"
			/>
		</div>
	</TheSectionWrapper>
</template>

<style lang="scss" module>
.HomeBlog {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 3.2rem;

	@include media($tablet) {
		grid-template-columns: repeat(2, 1fr);
	}

	@include media($mobile) {
		grid-template-columns: 1fr;
	}
}

.more {
	font-size: 1.2rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: $gray4;
	text-decoration: none;
	transition: $default-transition;
	white-space: nowrap;

	@include hover {
		color: $white;
	}
}
</style>

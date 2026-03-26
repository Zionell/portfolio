<script setup lang="ts">
import type { BlogPost } from "~~/generated/prisma/client";

const props = defineProps<{
	content: BlogPost[];
}>();
</script>

<template>
	<TheSectionWrapper :title="$t('sections.blog')">
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
				:class="$style.card"
			/>
		</div>
	</TheSectionWrapper>
</template>

<style lang="scss" module>
.HomeBlog {
	display: flex;
	flex-wrap: wrap;
	gap: 2rem;
}

.card {
	flex: 1 0 32%;
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

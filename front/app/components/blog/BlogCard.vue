<script setup lang="ts">
import type { BlogPost } from "~~/generated/prisma/client";

const props = defineProps<{
	post: BlogPost;
}>();

const { locale } = useI18n();

const coverSrc = computed(() => {
	return props.post.cover || "/images/default.png";
});

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
	<NuxtLink :to="`/blog/${props.post.slug}`" :class="$style.BlogCard">
		<div :class="$style.cover">
			<NuxtImg
				:class="$style.coverImg"
				:src="coverSrc"
				:alt="post.title"
				loading="lazy"
				placeholder
			/>
		</div>

		<div :class="$style.content">
			<div :class="$style.meta">
				<ul :class="$style.tags">
					<li v-for="tag in post.tags" :key="tag" :class="$style.tag">
						{{ tag }}
					</li>
				</ul>
				<span :class="$style.dot" />
				<span :class="$style.date">{{ formattedDate }}</span>
				<span :class="$style.dot" />
				<span :class="$style.readTime">
					{{ post.readTime }} {{ $t("common.readTime") }}
				</span>
			</div>

			<h3 :class="$style.title">{{ post.title }}</h3>
			<p :class="$style.excerpt">{{ post.excerpt }}</p>
		</div>
	</NuxtLink>
</template>

<style lang="scss" module>
.BlogCard {
	display: flex;
	flex-direction: column;
	gap: 1.6rem;
	padding: 2.4rem;
	border-radius: 1.2rem;
	border: 1px solid $gray2;
	transition: $default-transition;
	min-height: 30rem;
	cursor: pointer;

	@include hover {
		transform: translateY(-4px);
		border-color: $gray5;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
	}
}

.cover {
	display: block;
	height: 12rem;
	border-radius: 0.9rem;
	overflow: hidden;
	flex-shrink: 0;
}

.coverImg {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.content {
	display: flex;
	flex-direction: column;
	gap: 1.6rem;
	height: 100%;
}

.meta {
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

.title {
	font-family: $ff-title;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	font-size: 2rem;
	color: $white;
}

.excerpt {
	margin-top: auto;
	font-size: 1.4rem;
	line-height: 1.6;
	color: $gray5;
}
</style>

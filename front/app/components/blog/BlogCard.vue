<script setup lang="ts">
import type { Posts } from "~~/generated/prisma/client";
import { useMouseInElement } from "@vueuse/core";

const props = defineProps<{
	post: Posts;
}>();

const { locale } = useI18n();

const targetRef = useTemplateRef<HTMLElement>("targetRef");
const { elementX, elementY } = useMouseInElement(targetRef);

const position = computed(() => {
	return {
		left: `${elementX.value}px`,
		top: `${elementY.value}px`,
	};
});

const formattedDate = computed(() => {
	const date = new Date(props.post.date);

	if (Number.isNaN(date.getTime())) {
		return props.post.date;
	}

	return date.toLocaleDateString(locale.value, {
		month: "short",
		year: "numeric",
	});
});
</script>

<template>
	<div ref="targetRef" :class="$style.BlogCard">
		<NuxtLink :to="`/blog/${props.post.slug}`" :class="$style.inner">
			<NuxtImg
				:class="$style.coverImg"
				:src="props.post?.cover || '/images/default.png'"
				:alt="post.title"
				loading="lazy"
				placeholder
			/>

			<div :class="$style.body">
				<div :class="$style.meta">
					<span v-if="props.post?.type" :class="$style.type">
						{{ props.post.type }}
					</span>
					<span :class="$style.date">{{ formattedDate }}</span>
				</div>

				<h3 :class="$style.title">{{ post.title }}</h3>
				<p :class="$style.excerpt">{{ post.excerpt }}</p>

				<div :class="$style.bottom">
					<span :class="$style.read">
						{{ post.readTime }} {{ $t("common.readTime") }}
					</span>
				</div>
			</div>
		</NuxtLink>

		<div :class="$style.circle" :style="position" />
	</div>
</template>

<style lang="scss" module>
.BlogCard {
	position: relative;
	overflow: hidden;
	background: $gray2;
	padding: 1px;
	border-radius: 1.2rem;
}

.circle {
	position: absolute;
	top: 0;
	left: 0;
	width: 30rem;
	height: 30rem;
	border-radius: 100%;
	transform: translate(-50%, -50%);
	background: radial-gradient($white, $gray3);
}

.inner {
	position: relative;
	z-index: 2;
	background: $black;
	display: flex;
	flex-direction: column;
	height: 100%;
	border-radius: 1.3rem;
	overflow: hidden;
	transition: $default-transition;
	cursor: pointer;
	text-decoration: none;
	color: $white;
}

.coverImg {
	flex-shrink: 0;
	overflow: hidden;
	width: 100%;
	height: 20rem;
	object-fit: cover;
	background: #3f424d;
}

.body {
	padding: 2rem 2.4rem 2.4rem;
	display: flex;
	flex-direction: column;
	gap: 1.4rem;
	flex: 1;
}

.meta {
	display: flex;
	align-items: center;
	gap: 1rem;
	justify-content: space-between;
}

.type {
	display: inline-flex;
	align-items: center;
	font-size: 1.2rem;
	letter-spacing: 0.02em;
	padding: 0.4rem 1rem;
	border: 1px solid $gray3;
	border-radius: 0.8rem;
	color: $gray6;
}

.date {
	font-size: 1.2rem;
	color: $gray4;
}

.title {
	font-family: $ff-title;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	font-size: 2rem;
	line-height: 1.4;
	color: $white;
}

.excerpt {
	@include truncate(5);
	font-size: 1.4rem;
	line-height: 1.6;
	color: $gray5;
}

.bottom {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-top: auto;
	justify-content: space-between;
}

.project {
	font-size: 1.2rem;
	color: $gray6;
}

.read {
	font-size: 1.2rem;
	color: $gray4;
	margin-left: auto;
}
</style>

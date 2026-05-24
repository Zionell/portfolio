<script setup lang="ts">
import type { Posts } from "~~/generated/prisma/client";
import { useMouseInElement } from "@vueuse/core";
import BlogMetaInfo from "~/components/blog/BlogMetaInfo.vue";

const props = defineProps<{
	post: Posts;
}>();

const targetRef = useTemplateRef<HTMLElement>("targetRef");
const { elementX, elementY } = useMouseInElement(targetRef);

const coverSrc = computed(() => {
	return props.post.cover || "/images/default.png";
});

const position = computed(() => {
	return {
		left: `${elementX.value}px`,
		top: `${elementY.value}px`,
	};
});
</script>

<template>
	<div ref="targetRef" :class="$style.BlogCard">
		<NuxtLink :to="`/blog/${props.post.slug}`" :class="$style.inner">
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
				<BlogMetaInfo :post="post" />

				<h3 :class="$style.title">{{ post.title }}</h3>
				<p :class="$style.excerpt">{{ post.excerpt }}</p>
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
	gap: 1.6rem;
	padding: 2.4rem;
	height: 100%;
	border-radius: 1.3rem;
	transition: $default-transition;
	min-height: 30rem;
	cursor: pointer;

	//@include hover {
	//	transform: translateY(-4px);
	//	border-color: $gray5;
	//	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
	//}
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

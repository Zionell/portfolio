<script setup lang="ts">
import { api } from "~/assets/data/api";
import BlogMetaInfo from "~/components/blog/BlogMetaInfo.vue";

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));

const { data: post } = await useFetch(`${api.blog}/${slug.value}`);

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
</script>

<template>
	<section v-if="post" :class="$style.BlogDetail">
		<header :class="$style.header">
			<NuxtLink :class="$style.back" to="/blog">Back to Blog</NuxtLink>
			<span :class="$style.rule" />
		</header>

		<div :class="$style.postHeader">
			<NuxtImg
				:class="$style.cover"
				:src="post.cover || '/images/default.png'"
				:alt="post.title"
				placeholder
			/>
			<div :class="$style.postMeta">
				<h1 :class="$style.title">{{ post.title }}</h1>
				<p :class="$style.excerpt">{{ post.excerpt }}</p>

				<BlogMetaInfo :post="post" />
			</div>
		</div>

		<div :class="$style.divider" />

		<div v-for="item in post.content" :key="item" :class="$style.content">
			<div v-if="item?.text" v-html="item.text" />
			<NuxtImg
				v-if="item?.image"
				:class="$style.inlineImage"
				:src="item.image"
				:alt="post.title"
				placeholder
			/>
		</div>
	</section>
</template>

<style lang="scss" module>
.BlogDetail {
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

.back {
	font-size: 1.1rem;
	letter-spacing: 0.3em;
	text-transform: uppercase;
	color: $gray4;
	text-decoration: none;
	transition: $default-transition;

	@include hover {
		color: $white;
	}
}

.rule {
	height: 1px;
	flex: 1;
	background: rgba(255, 255, 255, 0.12);
}

.postMeta {
	display: grid;
	gap: 1.6rem;
	max-width: 72rem;
}

.postHeader {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2.4rem;
	align-items: start;
	max-width: 100%;
	margin: 0;
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

.title {
	font-family: $ff-title;
	font-size: 4.6rem;
	line-height: 1.1;
	text-transform: uppercase;

	//@media #{$mobile} {
	//	font-size: 3.2rem;
	//}
}

.excerpt {
	font-size: 1.6rem;
	line-height: 1.7;
	color: $gray5;
}

.cover {
	width: 100%;
	height: 40rem;
	object-fit: cover;
	border-radius: 1.6rem;
}

.divider {
	height: 1px;
	width: 100%;
	background: rgba(255, 255, 255, 0.12);
	margin: 1.6rem 0;
}

.inlineImage {
	width: 100%;
	height: 32rem;
	object-fit: cover;
	border-radius: 1.6rem;
}

.content {
	display: grid;
	gap: 1.6rem;
	max-width: 72rem;
	font-size: 1.6rem;
	line-height: 1.8;
	color: $gray5;
	margin: 0 auto;
}
</style>

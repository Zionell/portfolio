<script setup lang="ts">
import { api } from "~/assets/data/api";
import BlogMetaInfo from "~/components/blog/BlogMetaInfo.vue";

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));

const { data: post } = await useFetch(`${api.blog}/${slug.value}`);
</script>

<template>
	<main v-if="post" :class="[$style.BlogDetail, 'container']">
		<header :class="$style.header">
			<NuxtLink :class="$style.back" to="/blog">
				<span aria-hidden="true">←</span>
				{{ $t("blog.back") }}
			</NuxtLink>
			<span :class="$style.rule" />
		</header>

		<div :class="$style.postHeader">
			<div :class="$style.coverWrap">
				<NuxtImg
					:class="$style.cover"
					:src="post.cover || '/images/default.png'"
					:alt="post.title"
					placeholder
				/>
			</div>

			<div :class="$style.postMeta">
				<h1 :class="$style.title">{{ post.title }}</h1>
				<p :class="$style.excerpt">{{ post.excerpt }}</p>

				<BlogMetaInfo :post="post" />
			</div>
		</div>

		<div :class="$style.divider" />

		<div
			v-for="item in post.content"
			:key="item.id"
			:class="$style.content"
		>
			<div v-if="item?.text" :class="$style.text" v-html="item.text" />
			<NuxtImg
				v-if="item?.image"
				:class="$style.inlineImage"
				:src="item.image"
				:alt="post.title"
				placeholder
			/>
		</div>
	</main>
</template>

<style lang="scss" module>
.BlogDetail {
	display: flex;
	flex-direction: column;
	gap: 3.2rem;
	padding: 14rem 6rem 10rem;

	@include media($mobile) {
		padding: 8rem 2rem 4rem;
		gap: 2.4rem;
	}
}

.header {
	display: flex;
	align-items: center;
	gap: 2.4rem;
}

.back {
	display: inline-flex;
	align-items: center;
	gap: 0.8rem;
	font-size: 1.2rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: $gray4;
	text-decoration: none;
	white-space: nowrap;
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

.postHeader {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2.8rem;
	align-items: start;
}

.coverWrap {
	border-radius: 1.6rem;
	overflow: hidden;
	box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
	background: $gray1;
}

.cover {
	width: 100%;
	height: 40rem;
	object-fit: cover;
	display: block;

	@include media($tablet) {
		height: 32rem;
	}

	@include media($mobile) {
		height: 24rem;
	}
}

.postMeta {
	display: grid;
	gap: 1.6rem;
	max-width: 50%;

	@include media($mobile) {
		max-width: 90%;
	}
}

.title {
	font-family: $ff-title;
	font-size: 4.2rem;
	line-height: 1.12;
	text-transform: uppercase;
	color: $white;

	@include media($mobile) {
		font-size: 3.2rem;
	}
}

.excerpt {
	font-size: 1.6rem;
	line-height: 1.8;
	color: $gray5;
}

.divider {
	height: 1px;
	width: 100%;
	background: rgba(255, 255, 255, 0.12);
	margin: 0.8rem 0;
}

.content {
	display: grid;
	gap: 1.6rem;
	max-width: 80%;
	width: 100%;
	margin: 0 auto;

	@include media($mobile) {
		max-width: 100%;
	}
}

.text {
	font-size: 1.6rem;
	line-height: 1.8;
	color: $gray5;

	p {
		margin-bottom: 1.6rem;
	}

	h2,
	h3 {
		font-family: $ff-title;
		text-transform: uppercase;
		color: $white;
		margin: 2.8rem 0 1.4rem;

		@include media($mobile) {
			margin-top: 0;
		}
	}

	h2 {
		font-size: 2.6rem;
	}

	h3 {
		font-size: 2.1rem;
	}

	ul,
	ol {
		margin-bottom: 1.6rem;
		padding-left: 1.2em;
		display: grid;
		gap: 0.8rem;
	}

	li {
		list-style: disc;
	}

	ol li {
		list-style: decimal;
	}

	a {
		color: $gray6;
		text-underline-offset: 3px;

		&:hover {
			color: $white;
		}
	}

	blockquote {
		margin-bottom: 1.6rem;
		padding: 1.4rem 2rem;
		border-left: 2px solid $gray3;
		background: rgba(255, 255, 255, 0.03);
		color: $gray6;
	}

	pre {
		margin-bottom: 1.6rem;
		padding: 1.6rem 2rem;
		border-radius: 0.9rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		overflow-x: auto;
		font-size: 1.4rem;
	}

	code {
		font-size: 0.92em;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 0.4rem;
		padding: 0.2rem 0.6rem;
	}

	pre code {
		background: none;
		padding: 0;
	}

	img {
		max-width: 100%;
		border-radius: 0.9rem;
	}
}

.inlineImage {
	width: 100%;
	max-height: 42rem;
	object-fit: cover;
	border-radius: 1.6rem;
}
</style>

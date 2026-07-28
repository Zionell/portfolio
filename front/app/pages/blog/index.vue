<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { Posts } from "~~/generated/prisma/client";
import type { IPaginatedData } from "#shared/types/common.types";

const activeType = ref<string | null>(null);
const pageSize = 9;
const page = ref(1);

const { data: posts, status } = await useFetch<IPaginatedData<Posts>>(
	api.blog,
	{
		query: {
			type: activeType,
			limit: pageSize,
			page: page,
		},
	},
);

watch(activeType, () => {
	page.value = 1;
});
</script>

<template>
	<main :class="[$style.BlogPage, 'container']">
		<section :class="$style.hero">
			<p :class="$style.kicker">{{ $t("sections.blog") }}</p>

			<h1 :class="$style.title">
				{{ $t("blog.titleStart") }}
				<span :class="$style.amp">&amp;</span>
				{{ $t("blog.titleEnd") }}
			</h1>
		</section>

		<!--		<section v-if="specs && specs.length > 1" :class="$style.filters">-->
		<!--			<HomeTagFilter v-model="activeType" :tags="specs" />-->
		<!--		</section>-->

		<Transition name="list" mode="out-in">
			<div
				v-if="posts?.data?.length"
				:key="`loading_${status}`"
				:class="$style.grid"
			>
				<BlogCard
					v-for="post in posts.data"
					:key="post.id"
					:post="post"
				/>
			</div>

			<div v-else :class="$style.empty">
				{{ $t("blog.empty") }}
			</div>
		</Transition>

		<div
			v-if="posts?.count && posts.count > pageSize"
			:class="$style.pagination"
		>
			<BlogPagination
				v-model="page"
				:total="posts.count"
				:per-page="pageSize"
			/>
		</div>
	</main>
</template>

<style lang="scss" module>
.BlogPage {
	padding: 14rem 6rem 10rem;
	display: flex;
	flex-direction: column;
	gap: 3.2rem;

	@include media($mobile) {
		padding: 8rem 2rem 6rem;
		gap: 2.4rem;
	}
}

.hero {
	display: grid;
	gap: 2rem;
	justify-items: start;
}

.kicker {
	display: flex;
	align-items: center;
	gap: 1.2rem;
	font-size: 1.2rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: $gray4;

	&:before {
		content: "";
		width: 4.4rem;
		height: 1px;
		background: $gray3;
	}
}

.title {
	font-family: $ff-title;
	color: $white;
	font-size: 4.2rem;
	line-height: 1.08;
	text-transform: uppercase;

	@include media($mobile) {
		font-size: 3.2rem;
	}
}

.amp {
	color: $gray4;
}

.filters {
	display: flex;
	flex-wrap: wrap;
	gap: 1.6rem;
	align-items: center;
}

.grid {
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

.empty {
	padding: 4rem 0;
	font-size: 1.5rem;
	color: $gray4;
}

.pagination {
	display: flex;
	justify-content: center;
	padding-top: 2rem;
}
</style>

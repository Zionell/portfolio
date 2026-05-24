<script setup lang="ts">
import { api } from "~/assets/data/api";
import type { Posts } from "~~/generated/prisma/client";
import type { IPaginatedData } from "#shared/types/common.types";

const activeType = ref<string | null>(null);
const pageSize = 9;
const page = ref(1);

const { data: specs } = await useFetch<ISpec[]>(api.blogSpecs);
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
</script>

<template>
	<TheSectionWrapper :class="$style.BlogPage" :title="$t('sections.blog')">
		<div :class="$style.filterGroup">
			<div v-if="specs && specs?.length > 1" :class="$style.filterBlock">
				<p :class="$style.filterLabel">Type</p>
				<div :class="$style.typeTabs">
					<HomeTagFilter v-model="activeType" :tags="specs" />
				</div>
			</div>
		</div>

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
	</TheSectionWrapper>
</template>

<style lang="scss" module>
.BlogPage {
	padding-top: 14rem;

	@include media($mobile) {
		padding-top: 6rem;
	}
}

.filterGroup {
	display: flex;
	gap: 2.4rem;
	padding: 2rem 0;
	border-top: 1px solid rgba(255, 255, 255, 0.08);
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.filterBlock {
	display: grid;
	gap: 1.2rem;
}

.filterLabel {
	font-size: 1.1rem;
	letter-spacing: 0.3em;
	text-transform: uppercase;
	color: $gray4;
}

.typeTabs {
	display: inline-flex;
	max-width: 52rem;
}

.grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 2rem;

	@include media($tablet) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@include media($mobile) {
		grid-template-columns: 1fr;
	}
}

.pagination {
	display: flex;
	justify-content: center;
	padding-top: 2rem;
}
</style>

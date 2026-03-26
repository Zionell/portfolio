<script setup lang="ts">
const props = defineProps<{
	page: number;
	total: number;
	perPage: number;
}>();

const emit = defineEmits<{
	(e: "update:page", value: number): void;
}>();

const totalPages = computed(() => {
	const pages = Math.ceil(props.total / props.perPage);
	return Math.max(1, pages);
});

const pages = computed(() =>
	Array.from({ length: totalPages.value }, (_, i) => i + 1),
);

const setPage = (value: number): void => {
	if (value < 1 || value > totalPages.value) {
		return;
	}
	emit("update:page", value);
};
</script>

<template>
	<nav v-if="totalPages > 1" :class="$style.BlogPagination">
		<button
			:class="$style.navBtn"
			type="button"
			:disabled="page <= 1"
			@click="setPage(page - 1)"
		>
			Prev
		</button>

		<button
			v-for="p in pages"
			:key="p"
			:class="[$style.pageBtn, { [$style._active]: p === page }]"
			type="button"
			@click="setPage(p)"
		>
			{{ p }}
		</button>

		<button
			:class="$style.navBtn"
			type="button"
			:disabled="page >= totalPages"
			@click="setPage(page + 1)"
		>
			Next
		</button>
	</nav>
</template>

<style lang="scss" module>
.BlogPagination {
	display: flex;
	align-items: center;
	gap: 1.2rem;
	flex-wrap: wrap;
}

.navBtn,
.pageBtn {
	border: 1px solid $gray3;
	border-radius: 0.8rem;
	padding: 0.6rem 1.2rem;
	font-size: 1.4rem;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: $gray5;
	transition: $default-transition;
	user-select: none;

	@include hover {
		border-color: $gray5;
		color: $white;
	}
}

.navBtn:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

._active {
	border-color: $gray5;
	color: $white;
	background: rgba(255, 255, 255, 0.06);
}
</style>

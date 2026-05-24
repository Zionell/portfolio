<script setup lang="ts">
const props = defineProps<{
	total: number;
	perPage: number;
}>();

const model = defineModel<number>({ default: 1 });

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

	model.value = value;
};
</script>

<template>
	<nav v-if="totalPages > 1" :class="$style.BlogPagination">
		<button
			:class="$style.navBtn"
			type="button"
			:disabled="model <= 1"
			@click="setPage(model - 1)"
		>
			Prev
		</button>

		<button
			v-for="p in pages"
			:key="p"
			:class="[$style.pageBtn, { [$style._active]: p === model }]"
			type="button"
			@click="setPage(p)"
		>
			{{ p }}
		</button>

		<button
			:class="$style.navBtn"
			type="button"
			:disabled="model >= totalPages"
			@click="setPage(model + 1)"
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

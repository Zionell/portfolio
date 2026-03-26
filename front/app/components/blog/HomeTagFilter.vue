<script setup lang="ts">
const props = defineProps<{
	tags: string[];
	active: string;
}>();

const emit = defineEmits<{
	(e: "update:active", value: string): void;
}>();

const activeIndex = computed(() =>
	Math.max(0, props.tags.indexOf(props.active)),
);
</script>

<template>
	<div
		:class="$style.segmented"
		:style="{
			'--segments': props.tags.length,
			'--active-index': activeIndex,
		}"
	>
		<span :class="$style.indicator" />
		<button
			v-for="tag in props.tags"
			:key="tag"
			:class="[$style.segment, { [$style._active]: tag === props.active }]"
			type="button"
			@click="emit('update:active', tag)"
		>
			{{ tag }}
		</button>
	</div>
</template>

<style lang="scss" module>
.segmented {
	--segments: 1;
	--active-index: 0;
	position: relative;
	display: grid;
	grid-template-columns: repeat(var(--segments), minmax(0, 1fr));
	background: rgba(255, 255, 255, 0.04);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 0;
	padding: 0.3rem;
	overflow: hidden;
}

.indicator {
	position: absolute;
	top: 0.3rem;
	left: 0.3rem;
	height: calc(100% - 0.6rem);
	width: calc((100% - 0.6rem) / var(--segments));
	background: rgba(255, 255, 255, 0.12);
	border-radius: 0;
	transform: translateX(calc(var(--active-index) * 100%));
	transition: $default-transition;
}

.segment {
	position: relative;
	z-index: 1;
	padding: 0.7rem 1.2rem;
	font-size: 1.1rem;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: $gray4;
	transition: $default-transition;
}

._active {
	color: $white;
}
</style>

<script setup lang="ts">
const props = defineProps<{
	tags: string[];
	active: string;
}>();

const emit = defineEmits<{
	(e: "update:active", value: string): void;
}>();

const setActive = (tag: string): void => {
	emit("update:active", tag);
};
</script>

<template>
	<div :class="$style.BlogFilter">
		<button
			v-for="tag in props.tags"
			:key="tag"
			:class="[$style.tag, { [$style._active]: tag === props.active }]"
			:aria-pressed="tag === props.active"
			type="button"
			@click="setActive(tag)"
		>
			{{ tag }}
		</button>
	</div>
</template>

<style lang="scss" module>
.BlogFilter {
	display: flex;
	flex-wrap: wrap;
	gap: 1.2rem;
}

.tag {
	border: 1px solid $gray3;
	border-radius: 999px;
	padding: 0.8rem 1.8rem;
	font-size: 1.4rem;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: $gray5;
	transition: $default-transition;
	user-select: none;

	@include hover {
		border-color: $gray5;
		color: $white;
	}
}

._active {
	border-color: $gray5;
	color: $white;
	background: rgba(255, 255, 255, 0.05);
}
</style>

<script setup lang="ts">
import type { ITag } from "#shared/types/common.types";

const props = defineProps<{
	tag: ITag;
}>();

const $style = useCssModule();

const classes = computed(() => {
	return [
		$style.tag,
		{
			[`${$style[`tag__${props.tag.color}`]}`]: props.tag.color,
		},
	];
});
</script>

<template>
	<div :class="classes">
		{{ props.tag.label }}
	</div>
</template>

<style module lang="scss">
.tag {
	font-size: 1.6rem;
	padding: 0.4rem 1.2rem;
	width: auto;
}

.tag__error {
	background: $error;
}

.tag__warning {
	background: $warning;
}
</style>

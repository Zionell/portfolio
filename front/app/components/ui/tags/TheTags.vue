<script setup lang="ts">
import { type ITag } from "#shared/types/common.types";
import TheTag from "~/components/ui/tags/TheTag.vue";

const props = defineProps<{
	tags: ITag[];
	column?: boolean;
}>();

const $style = useCssModule();

const classes = computed(() => {
	return [
		$style.tags,
		{
			[`${$style[`tags__column`]}`]: props.column,
		},
	];
});
</script>

<template>
	<div :class="classes">
		<TheTag
			v-for="(tag, ind) in props.tags"
			:key="`tag_${ind}`"
			:tag="tag"
		/>
	</div>
</template>

<style module lang="scss">
.tags {
	display: flex;
	gap: 1rem;
}

.tags__column {
	flex-direction: column;
	align-items: flex-end;
}
</style>

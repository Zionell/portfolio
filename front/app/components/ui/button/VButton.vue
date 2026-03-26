<script setup lang="ts">
interface IProps {
	disabled?: boolean;
	loading?: boolean;
	label: string;
}

const props = withDefaults(defineProps<IProps>(), {
	disabled: false,
	loading: false,
	label: "label",
});

const emit = defineEmits<{
	click: [value: MouseEvent];
}>();

const classList = computed(() => ({
	_disabled: props.disabled,
}));
</script>

<template>
	<button
		class="VButton"
		:class="classList"
		:disabled="disabled"
		v-bind="$attrs"
		@click="emit('click')"
	>
		<svg class="VButton__svg">
			<rect
				x="0"
				y="0"
				fill="none"
				width="100%"
				height="100%"
				stroke="currentColor"
			/>
		</svg>
		<span :class="['label', { VLoader: loading }]">
			{{ label }}
		</span>
	</button>
</template>

<style>
.VButton {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 40px;
	width: max-content;
	padding: 0 28px;
	outline: none;
	user-select: none;
	background: transparent;
	color: inherit;
}

.VButton._disabled {
	pointer-events: none;
	opacity: 0.5;
}

.VButton .label {
	text-transform: uppercase;
}

.VButton__svg {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.VButton rect {
	stroke-width: 5;
	stroke-dasharray: 15, 310;
	stroke-dashoffset: 48;
	transition: all 1.35s cubic-bezier(0.19, 1, 0.22, 1);
}

.VButton:hover rect {
	stroke-width: 2;
	stroke-dasharray: 422, 0;
	transition: all 0.35s linear;
}
</style>

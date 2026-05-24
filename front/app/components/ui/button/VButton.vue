<script setup lang="ts">
import type { Attrs } from "@vue/runtime-core";

interface IProps {
	disabled?: boolean;
	loading?: boolean;
	label: string;
	href?: string;
}

const props = withDefaults(defineProps<IProps>(), {
	disabled: false,
	loading: false,
	label: "label",
	href: "",
});

const emit = defineEmits<{
	click: [];
}>();

const $style = useCssModule();

const classList = computed(() => [
	$style.VButton,
	{
		[$style._loading]: props.loading,
		[$style._disabled]: props.disabled,
	},
]);

const attrs: Attrs = useAttrs();

const tag = computed(() => (props.href ? "a" : "button"));

const buttonAttrs = computed(() => {
	const attrObj: Attrs = {
		...attrs,
	};

	if (props.href) {
		attrObj.href = props.href;
		attrObj.target = "_blank";
	}

	return attrObj;
});
</script>

<template>
	<component
		:is="tag"
		:class="classList"
		:disabled="disabled"
		v-bind="buttonAttrs"
		@click="emit('click')"
	>
		<span :class="$style.label">
			{{ label }}
		</span>
	</component>
</template>

<style module lang="scss">
.VButton {
	position: relative;
	overflow: hidden;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 4.4rem;
	width: max-content;
	padding: 0 2.8rem;
	outline: none;
	user-select: none;
	background: transparent;
	color: inherit;
	border: 1px solid $gray5;

	&:before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		width: 100%;
		height: 100%;
		background: $gray5;
		z-index: 0;
		transform: translateX(-100%);
		transition: transform 0.35s ease;
	}

	&._disabled {
		pointer-events: none;
		opacity: 0.5;
	}

	&._loading {
		&:before {
			animation: anim 1s linear infinite alternate;
		}
	}

	@include hover {
		&:before {
			transform: translateX(0);
		}
	}
}

.label {
	font-size: 1.6rem;
	font-family: $ff-regular;
	position: relative;
	z-index: 2;
}

@keyframes anim {
	from {
		transform: translateX(-100%);
	}

	to {
		transform: translateX(100%);
	}
}
</style>

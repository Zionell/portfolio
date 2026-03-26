<script setup lang="ts">
const props = defineProps<{
	isActive: boolean;
}>();

const emit = defineEmits<{
	click: [value: boolean];
}>();
</script>

<template>
	<button
		:class="[$style.TheBurger, { [$style._isOpened]: props.isActive }]"
		type="button"
		@click="emit('click', !props.isActive)"
	>
		<span :class="$style.bars" />
		<span :class="$style.bars" />
		<span :class="$style.bars" />
	</button>
</template>

<style module lang="scss">
.TheBurger {
	position: relative;
	width: 3rem;
	height: 2rem;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	gap: 0.5rem;
	transition-duration: 0.5s;

	&._isOpened {
		transition-duration: 0.5s;
		transform: rotate(180deg);

		.bars {
			position: absolute;

			&:nth-child(1) {
				width: 100%;
				transform: rotate(45deg);
			}

			&:nth-child(2) {
				transform: scaleX(0);
			}

			&:nth-child(3) {
				width: 100%;
				transform: rotate(-45deg);
			}
		}
	}

	@include hover {
		&:not(._isOpened) {
			.bars {
				&:nth-child(1) {
					width: 75%;
				}

				&:nth-child(3) {
					width: 100%;
				}
			}
		}
	}
}

.bars {
	width: 100%;
	height: 0.2rem;
	background-color: $white;
	border-radius: 0.4rem;
	transition-duration: 0.5s;

	&:nth-child(2) {
		width: 75%;
		transition-duration: 0.1s;
	}

	&:nth-child(3) {
		width: 50%;
		transition-duration: 0.5s;
	}
}
</style>

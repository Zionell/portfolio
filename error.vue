<script
	setup
	lang="ts"
>

const props = defineProps({
	error: {
		type: Object,
		default: () => ({}),
	},
})
</script>

<template>
	<div :class="$style.error">
		<div :class="$style.numbers">
			{{ error?.statusCode ? error?.statusCode : '500' }}
		</div>
		<div :class="$style.text">
			{{ error?.statusCode === 404 ? 'Страница не найдена' : 'Ведутся технические работы' }}
		</div>
	</div>
</template>

<style
	lang="scss"
	module
>
	.error {
		position: fixed;
		z-index: 50;
		font-family: $ff-additional;
		background: linear-gradient(90deg, #414042 0%, #030303 99.99%, #231f20 100%);
		color: $gray5;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 100vh;
		user-select: none;
	}

	.numbers {
		font-size: 25rem;
		font-weight: 900;
	}

	.text {
		font-size: 3rem;
	}
</style>

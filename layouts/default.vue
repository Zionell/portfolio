<script
	setup
	lang="ts"
>
</script>

<template>
	<div :class="$style.default">
		<SideBar />
		<NavBar />

		<slot />
	</div>
</template>

<style
	lang="scss"
	module
>
	.default {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 100vh;
	}
</style>

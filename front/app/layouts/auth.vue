<script setup lang="ts">
useHead({
	meta: [
		{ charset: "utf-8" },
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1, user-scalable=no",
		},
		{ name: "robots", content: "noindex, nofollow" },
	],
});
</script>

<template>
	<div :class="$style.auth">
		<slot />
	</div>
</template>

<style lang="scss" module>
.auth {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4rem 2rem;
	background: #0a0a0a;
	color: $white;
}
</style>

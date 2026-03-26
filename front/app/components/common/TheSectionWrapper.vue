<script setup lang="ts">
const props = defineProps<{
	title?: string;
}>();
</script>

<template>
	<section :class="$style.TheSectionWrapper">
		<div v-if="props.title" :class="$style.header">
			<h2 :class="$style.title">{{ props.title }}</h2>
			<span :class="$style.rule" />
			<slot name="header"/>
		</div>

		<div>
			<slot />
		</div>
	</section>
</template>

<style module lang="scss">
.TheSectionWrapper {
	padding: 8rem 6rem;
	display: flex;
	flex-direction: column;
	gap: 3.2rem;
}

.header {
	display: flex;
	align-items: center;
	gap: 2.4rem;
}

.title {
	font-family: $ff-title;
	font-size: 4.2rem;
	text-transform: uppercase;
}

.rule {
	height: 1px;
	flex: 1;
	background: rgba(255, 255, 255, 0.12);
}
</style>

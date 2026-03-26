<script setup lang="ts">
import type { HomeAbout } from "~~/generated/prisma/client";

const props = defineProps<{
	content: HomeAbout;
}>();
</script>

<template>
	<TheSectionWrapper :title="$t('sections.about')">
		<div :class="$style.HomeAbout">
			<div v-if="props.content.text.length" :class="$style.text">
				<div
					v-for="(text, ind) in props.content.text"
					:key="ind"
					:class="$style.paragraph"
					v-html="text"
				/>
			</div>

			<div v-if="props.content.image" :class="$style.visual">
				<NuxtImg
					:class="$style.photo"
					:src="props.content.image"
					alt="Portfolio picture"
					placeholder
				/>
			</div>
		</div>
	</TheSectionWrapper>
</template>

<style lang="scss" module>
.HomeAbout {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 48rem);
	gap: 4rem;
	align-items: center;

	@include media($tablet) {
		grid-template-columns: 1fr;
	}
}

.text {
	display: grid;
	gap: 2rem;
	max-width: 78rem;
}

.paragraph {
	font-size: 1.8rem;
	line-height: 1.7;
	color: $gray5;

	@include media($mobile) {
		font-size: 1.6rem;
	}
}

.visual {
	position: relative;
	width: 100%;
}

.photo {
	width: 100%;
	height: auto;
	border-radius: 2.4rem;
	object-fit: cover;
	filter: contrast(1.05) saturate(1.05);
}
</style>

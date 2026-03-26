<script setup lang="ts">
import type { HomeSkill } from "~~/generated/prisma/client";

const props = defineProps<{
	content: HomeSkill[];
}>();
</script>

<template>
	<TheSectionWrapper :title="$t('sections.skills')">
		<div v-if="props.content.length" :class="$style.HomeSkills">
			<div
				v-for="item in props.content"
				:key="item.icon"
				:class="$style.card"
			>
				<span v-if="item.icon" v-html="item.icon" :class="$style.svg" />
				<span :class="$style.label">{{ item.label }}</span>
			</div>
		</div>
	</TheSectionWrapper>
</template>

<style lang="scss" module>
.HomeSkills {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
	gap: 1.6rem;
}

.card {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 2rem 1.6rem;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 1.6rem;
	background: rgba(255, 255, 255, 0.02);
	color: $gray4;
	transition: $default-transition;
	text-align: center;

	@include hover {
		color: $white;
		border-color: rgba(255, 255, 255, 0.25);
		transform: translateY(-4px);
	}
}

.label {
	font-size: 1.2rem;
	letter-spacing: 0.1em;
	text-transform: uppercase;
}

//.svg :global(svg) {
//	width: 3.2rem;
//	height: 3.2rem;
//}
</style>

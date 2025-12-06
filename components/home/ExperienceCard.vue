<script setup lang="ts">
import type { IExperience } from "~/assets/interfaces/interface";

defineProps<{
	card: IExperience;
}>();
</script>

<template>
	<div :class="$style.HomeExperienceCard">
		<div :class="$style.top">
			<h4 :class="$style.title">{{ card.company }}</h4>
			<div :class="[$style.period, 'text-24']">{{ card.period }}</div>
		</div>

		<div :class="[$style.position, 'text-24']">
			Position: {{ card.position }}
		</div>

		<div v-if="card.responsibilities.length" :class="$style.text">
			Responsibilities:
			<ul :class="$style.responsibilitiesList">
				<li v-for="res in card.responsibilities">{{ res }}</li>
			</ul>
		</div>

		<div v-if="card.stack.length" :class="[$style.stack, $style.text]">
			Stack:

			<div>{{ card.stack.join(", ") }}</div>
		</div>
	</div>
</template>

<style lang="scss" module>
.HomeExperienceCard {
	margin-bottom: 3.2rem;
}

.top {
	display: flex;
	align-items: center;

	@include respond-to(mobile) {
		flex-direction: column;
		align-items: flex-start;
		margin-bottom: 1.2rem;
	}
}

.title {
	margin-right: 1.6rem;
	color: $white;
	font-family: $ff-additional;
	font-size: 3.2rem;
	line-height: 140%;
	letter-spacing: 0.63rem;
	text-transform: uppercase;

	@include respond-to(mobile) {
		font-size: 2.4rem;
	}
}

.period {
	@include respond-to(mobile) {
		font-size: 1.4rem;
	}
}

.position {
	margin-bottom: 0.8rem;

	@include respond-to(mobile) {
		font-size: 1.8rem;
	}
}

.text {
	font-size: 2rem;
	line-height: 140%;

	&:not(:last-child) {
		margin-bottom: 0.8rem;
	}
}

.responsibilitiesList {
	display: flex;
	flex-direction: column;
	padding-left: 2.4rem;

	& > li {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: 1.6rem;

		&::before {
			content: "-";
		}
	}
}

.stack,
.stackList {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
}
</style>

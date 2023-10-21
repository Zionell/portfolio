<script
	setup
	lang="ts"
>

import {PropType} from "@vue/runtime-core";
import {IExperience} from "~/assets/interfaces/interface";

const props = defineProps({
	card: {
		type: Object as PropType<IExperience>,
		default: () => ({})
	}
})
</script>

<template>
	<div :class="$style.HomeExperienceCard">
		<div :class="$style.top">
			<h4 :class="$style.title">{{ card.company }}</h4>
			<div :class="[$style.period, 'text-24']">{{ card.period }}</div>
		</div>
		<div :class="[$style.position, 'text-24']">Position: {{ card.position }}</div>
		<div :class="$style.text">Tasks: {{card.tasks}}</div>
		<div :class="$style.text">Achievements: {{ card.achievements }}</div>
		<div :class="$style.text">Stack: {{card.stack}}</div>
	</div>
</template>

<style
	lang="scss"
	module
>
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
		letter-spacing: .63rem;
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
		margin-bottom: .8rem;

		@include respond-to(mobile) {
			font-size: 1.8rem;
		}
	}

	.text {
		font-size: 1.6rem;
		line-height: 140%;

		&:not(:last-child) {
			margin-bottom: .8rem;
		}
	}
</style>

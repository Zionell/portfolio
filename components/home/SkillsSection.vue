<script
	setup
	lang="ts"
>
import {useNuxtApp} from "nuxt/app";
import {onMounted, ref} from "vue";
import {HtmlType, SwiperType} from "~/assets/types";
import {PropType} from "@vue/runtime-core";
import {ISkill} from "assets/interfaces/interface";

const props = defineProps({
	title: {
		type: String,
		default: ''
	},

	slides: {
		type: Array as PropType<ISkill[]>,
		default: () => []
	}
});
</script>

<template>
	<div :class="$style.HomeSkillsSection">
		<h2 :class="$style.title">{{ title }}</h2>

		<div :class="$style.wrapper">
			<div
				v-for="(slide, ind) in slides"
				:key="ind"
				:class="$style.card"
			>
				<UiVIcon
					:name="slide.icon"
					size="large"
				/>
				<h4 :class="$style.label">{{ slide.label }}</h4>
			</div>
		</div>
	</div>
</template>

<style
	lang="scss"
	module
>
	.HomeSkillsSection {
		//
	}

	.title {
		padding-bottom: 3rem;
		font-size: 3.2rem;
		font-weight: 700;
		color: $gray5;

		@include respond-to(mobile) {
			font-size: 2.4rem;
		}
	}

	.wrapper {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		gap: 3.2rem;

		@include respond-to(mobile) {
			gap: 1.6rem;
		}
	}

	.card {
		display: grid;
		gap: 2.4rem;
		justify-items: center;

		@include respond-to(mobile) {
			gap: 1.6rem;
		}
	}

	.label {
		font-size: 1.8rem;
	}
</style>

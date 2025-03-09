<script
	setup
	lang="ts"
>
import type {ISkill} from "~/assets/interfaces/interface";
import gsap from "gsap";
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger)

defineProps<{
    title: string,
    slides: ISkill[]
}>()

const sectionRef = useTemplateRef('section');

function scrollAnimation(): void {
	gsap.from('.skillRefs', {
		scrollTrigger: {
			trigger: sectionRef.value,
			start: 'top 50%',
			toggleActions: 'play none play reverse',
		},
		x: '100vw',
		duration: .2,
		delay: 0.2,
		stagger: 0.1,
	})
}

onMounted((): void => {
	scrollAnimation()
})
</script>

<template>
	<div :class="$style.HomeSkillsSection">
		<h2 :class="$style.title">{{ title }}</h2>

		<div
			ref="section"
			:class="$style.wrapper"
		>
			<div
				v-for="(slide, ind) in slides"
				:key="ind"
				:class="[$style.card, 'skillRefs']"
			>
				<VIcon
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
        text-align: center;
		font-size: 1.8rem;
	}
</style>

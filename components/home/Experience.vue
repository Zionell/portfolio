<script
	setup
	lang="ts"
>
import {onMounted, ref} from "vue";
import {useExperienceStore} from "~/store/experience"
import type {HtmlType} from "~/assets/types";
import {gsap} from "gsap";

const sectionRef = ref<HtmlType>(null)
const {$state} = useExperienceStore()
const cardRefs = ref<HtmlType[]>([])

function scrollAnimation(): void {
	gsap.utils.toArray('.experience_card').forEach((p: HtmlType, ind: number): void => {
		gsap.from(p, {
			scrollTrigger: {
				trigger: sectionRef.value,
				start: 'top 50%',
				toggleActions: 'play none play reverse',
			},
			x: () => ind % 2 === 0 ? '100vw' : '-100vw'
		})
	})
}

onMounted((): void => {
	scrollAnimation()
})
</script>

<template>
	<section
		id="experience"
		ref="sectionRef"
		:class="[$style.HomeExperience, 'section']"
	>
		<h2 :class="[$style.title, 'title']">Experience</h2>
		<HomeExperienceCard
			v-for="(card, ind) in $state"
			:key="ind"
			class="experience_card"
			:card="card"
		/>
	</section>
</template>

<style
	lang="scss"
	module
>
	.HomeExperience {
		//
	}

	.title {
		padding-bottom: 5.6rem;

		@include respond-to(mobile) {
			padding-bottom: 3.2rem;
		}
	}
</style>

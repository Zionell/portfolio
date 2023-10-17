<script
	setup
	lang="ts"
>
import {onMounted, ref} from 'vue'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';
import {HtmlType} from "~/assets/types";
import {useSkillsStore} from "~/store/skills";

gsap.registerPlugin(ScrollTrigger)

const {$state} = useSkillsStore()
const sectionRef = ref<HtmlType>(null)

function scrollAnimation(): void {
	gsap.utils.toArray('.skillRefs').forEach((p: HTMLElement | unknown, ind: number): void => {
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
	<div
		id="skills"
		ref="sectionRef"
		:class="[$style.HomeSkills, 'section']"
	>
		<h2 :class="[$style.title, 'title']">Skills&Tools</h2>
		<HomeSkillsSection
			v-for="(skill, ind) in $state"
			:key="ind"
			:class="[$style.skillItem, 'skillRefs']"
			:title="skill.title"
			:slides="skill.items"
		/>
	</div>
</template>

<style
	lang="scss"
	module
>
	.HomeSkills {
		//
	}

	.title {
		padding-bottom: 5.6rem;
	}

	.paragraph {
		padding-bottom: 4rem;
		font-size: 2.4rem;
		line-height: 3.2rem;
		color: $gray5;
	}

	.skillItem {
		&:not(&:last-child) {
			padding-bottom: 5.6rem;
		}
	}
</style>

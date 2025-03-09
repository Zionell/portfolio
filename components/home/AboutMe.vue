<script
	setup
	lang="ts"
>
import gsap from "gsap";
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger)

const {state} = useAboutStore()
const sectionRef = useTemplateRef('section')
const paragraphRefs = useTemplateRef('paragraphs')

function scrollAnimation(): void {
	gsap.utils.toArray(paragraphRefs.value).forEach((p, ind: number): void => {
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
		id="about"
		ref="section"
		:class="[$style.HomeAboutMe, 'section']"
	>
		<h2 :class="[$style.title, 'title']">About me</h2>
		<p
			v-for="(text, ind) in state"
			ref="paragraphs"
			:key="ind"
			:class="$style.paragraph"
			v-html="text.value"
		/>
	</section>
</template>

<style
	lang="scss"
	module
>
	.HomeAboutMe {
		padding-bottom: 4rem;
		color: $gray5;

		@include respond-to(mobile) {
			padding-bottom: 2.4rem;
		}
	}

	.title {
		padding-bottom: 5.6rem;

		@include respond-to(mobile) {
			padding-bottom: 3.2rem;
		}
	}

	.paragraph {
		&:not(:last-child) {
			margin-bottom: 1rem;
		}
	}

	.paragraph a {
		color: $white;
	}

	.paragraph,
	.paragraph a {
		font-size: 2.4rem;
		line-height: 144%;

		@include respond-to(mobile) {
			font-size: 1.6rem;
		}
	}
</style>

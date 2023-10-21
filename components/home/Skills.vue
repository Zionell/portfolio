<script
	setup
	lang="ts"
>
import {useSkillsStore} from "~/store/skills";

const {$state} = useSkillsStore()
</script>

<template>
	<div
		id="skills"
		:class="[$style.HomeSkills, 'section']"
	>
		<h2 :class="[$style.title, 'title']">Skills&Tools</h2>
		<HomeSkillsSection
			v-for="(skill, ind) in $state"
			:key="ind"
			:class="$style.skillItem"
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

		@include respond-to(mobile) {
			padding-bottom: 3.2rem;
		}
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

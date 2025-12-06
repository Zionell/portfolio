<script setup lang="ts">
import { skills } from "~/assets/data/skills";
</script>

<template>
	<div id="skills" :class="[$style.HomeSkills, 'section']">
		<h2 :class="[$style.title, 'title']">Skills&Tools</h2>

		<SkillsSection
			v-for="(skill, ind) in skills"
			:key="ind"
			:class="$style.skillItem"
			:title="skill.title"
			:slides="skill.items"
		/>
	</div>
</template>

<style lang="scss" module>
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

.usedLanguages {
	display: flex;
	width: 40vw;

	img {
		width: 100%;
		height: 100%;
	}

	@include respond-to(mobile) {
		width: 100%;
	}
}
</style>

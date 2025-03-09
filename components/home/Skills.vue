<script setup lang="ts">
const { $state } = useSkillsStore();
</script>

<template>
	<div id="skills" :class="[$style.HomeSkills, 'section']">
		<h2 :class="[$style.title, 'title']">Skills&Tools</h2>
		<SkillsSection
			v-for="(skill, ind) in $state"
			:key="ind"
			:class="$style.skillItem"
			:title="skill.title"
			:slides="skill.items"
		/>

		<a
			:class="$style.usedLanguages"
			target="_blank"
			href="https://github.com/Zionell"
		>
			<img
				src="https://github-readme-stats.vercel.app/api/top-langs/?username=Zionell&theme=merko&layout=compact"
				alt="Zionell's github top languages"
			/>
		</a>
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

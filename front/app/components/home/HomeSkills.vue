<script setup lang="ts">
import type { HomeSkill } from "~~/generated/prisma/client";

const props = defineProps<{
	content: HomeSkill[];
}>();

const { $gsap } = useNuxtApp();
const wrapperRef = useTemplateRef("wrapperRef");
const itemRef = useTemplateRef("itemRef");

const animate = () => {
	$gsap.fromTo(
		itemRef.value,
		{
			scale: 0.1,
			y: 40,
			opacity: 0,
		},
		{
			scrollTrigger: {
				trigger: wrapperRef.value,
				start: "top 60%",
				end: "top 90%",
				toggleActions: "play none resume reverse",
			},
			ease: "power1.inOut",
			stagger: {
				grid: [7, 15],
				from: "random",
				ease: "power2.in",
				amount: 1.5,
			},
			opacity: 1,
			duration: 1,
			scale: 1,
			y: 0,
		},
	);
};

onMounted(() => {
	nextTick(animate);
});
</script>

<template>
	<TheSectionWrapper :title="$t('sections.skills')">
		<div
			v-if="props.content.length"
			ref="wrapperRef"
			:class="$style.HomeSkills"
		>
			<div
				v-for="item in props.content"
				:key="item.icon"
				ref="itemRef"
				:class="$style.card"
			>
				<span v-if="item.icon" v-html="item.icon" :class="$style.svg" />
				<span :class="$style.label">{{ item.label }}</span>
			</div>
		</div>
	</TheSectionWrapper>
</template>

<style lang="scss" module>
.HomeSkills {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
	gap: 1.6rem;
}

.card {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 2rem 1.6rem;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 1.6rem;
	background: rgba(255, 255, 255, 0.02);
	color: $gray4;
	transition: $default-transition;
	text-align: center;

	@include hover {
		color: $white;
		border-color: rgba(255, 255, 255, 0.25);
		transform: translateY(-4px);
	}
}

.label {
	font-size: 1.2rem;
	letter-spacing: 0.1em;
	text-transform: uppercase;
}

.svg {
	width: 4.2rem;
	height: 4.2rem;

	svg {
		width: 100%;
		height: 100%;
	}
}
</style>

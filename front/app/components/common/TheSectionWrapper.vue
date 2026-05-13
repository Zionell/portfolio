<script setup lang="ts">
const props = defineProps<{
	title?: string;
}>();

const { $gsap, $splitText } = useNuxtApp();
const wrapperRef = useTemplateRef("wrapperRef");
const titleRef = useTemplateRef("titleRef");

const animate = () => {
	$splitText.create(titleRef.value, {
		type: "chars",
		onSplit: (self) => {
			$gsap.from(self.chars, {
				scrollTrigger: {
					trigger: wrapperRef.value,
					start: "top 60%",
					end: "top 90%",
					toggleActions: "play none resume reverse",
				},
				x: 100,
				autoAlpha: 0,
				stagger: 0.05,
			});
		},
	});
};

onMounted(() => {
	nextTick(animate);
});
</script>

<template>
	<section ref="wrapperRef" :class="$style.TheSectionWrapper">
		<div v-if="props.title" :class="$style.header">
			<h2 ref="titleRef" :class="$style.title">{{ props.title }}</h2>
			<span :class="$style.rule" />
			<slot name="header" />
		</div>

		<div>
			<slot />
		</div>
	</section>
</template>

<style module lang="scss">
.TheSectionWrapper {
	overflow: hidden;
	padding: 8rem 6rem;
	display: flex;
	flex-direction: column;
	gap: 3.2rem;
	width: 100%;
}

.header {
	display: flex;
	align-items: center;
	gap: 2.4rem;
}

.title {
	font-family: $ff-title;
	font-size: 4.2rem;
	text-transform: uppercase;
}

.rule {
	height: 1px;
	flex: 1;
	background: rgba(255, 255, 255, 0.12);
}
</style>

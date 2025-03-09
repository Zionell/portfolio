<script setup lang="ts">
import gsap from "gsap";
import { scrollToBlock } from "~/assets/js/utils";

const myProfession = "Frontend-developer".split("");
const handleClick = (): void => {
	scrollToBlock("about");
};

const initialAnimation = () => {
	gsap.from("#image", {
		x: -600,
		duration: 1,
	});
	gsap.from("#title", {
		x: 800,
		duration: 1,
	});
	gsap.from(`.heroChar`, {
		y: 800,
		duration: 0.2,
		delay: 0.6,
		stagger: 0.1,
	});
};

onMounted((): void => {
	initialAnimation();
});
</script>

<template>
	<section id="main" :class="[$style.HomeHero, 'section']">
		<button :class="$style.scrollBtn" @click="handleClick">
			<VIcon name="cursor" />
		</button>
		<div id="image" :class="$style.imgWrap">
			<NuxtImg
				:class="$style.img"
				alt="This is me"
				src="/images/my-photo.jpg"
				:modifiers="{
					format: 'webp',
				}"
				placeholder
			/>
		</div>
		<h1 id="title" :class="$style.title">
			Askarov
			<br />
			Adilkhan
		</h1>
		<div :class="$style.label">
			<p
				v-for="(p, ind) in myProfession"
				:key="ind"
				:class="[$style.labelChar, 'heroChar']"
			>
				{{ p }}
			</p>
		</div>
	</section>
</template>

<style lang="scss" module>
.HomeHero {
	position: relative;
	overflow: hidden;
	display: grid;
	align-items: center;
	grid-template-columns: 1fr 1.3fr 1rem;
	justify-items: center;
	gap: 3rem;

	@include respond-to(tablet) {
		grid-template-columns: 1fr 1rem;
		justify-items: flex-start;
	}
}

.scrollBtn {
	position: absolute;
	bottom: 5.6rem;
	left: 50%;
	color: $gray5;
	transform: translateX(-50%);

	@include hover {
		color: $gray2;
	}

	@include respond-to(tablet) {
		display: none;
	}
}

.title {
	display: flex;
	align-items: center;
	text-transform: uppercase;
	font-family: $ff-additional;
	font-size: 9rem;
	font-weight: 700;
	line-height: 120%;
	letter-spacing: 0.07em;
	color: $gray5;
	user-select: none;

	@include respond-to(tablet) {
		grid-row: 2/3;
	}

	@include respond-to(mobile) {
		align-self: flex-start;
		font-size: 3.2rem;
	}
}

.imgWrap {
	width: 100%;
	height: 52rem;
	overflow: hidden;
	border-radius: 1rem 10rem;
	filter: drop-shadow(10px 4px 6px black);

	@include respond-to(tablet) {
		max-width: 70rem;
		max-height: 50rem;
	}

	@include respond-to(mobile) {
		height: 28rem;
		border-radius: 1rem 5rem;
	}
}

.img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.label {
	width: 1rem;
	text-align: center;
	text-transform: uppercase;
	font-size: 1.6rem;
	line-height: 144%;
	color: $gray5;
	user-select: none;

	@include respond-to(tablet) {
		grid-row: 1/3;
	}
}
</style>

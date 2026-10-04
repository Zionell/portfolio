<script setup lang="ts">
import type { HomeHero } from "~~/generated/prisma/client";
import type { IHomeAvailability } from "#shared/types/home.types";
import FluidBg from "~/components/common/FluidBg.vue";

const props = defineProps<{
	content: HomeHero;
	availability?: IHomeAvailability | null;
}>();

const { $gsap, $splitText } = useNuxtApp();
const titleRef = useTemplateRef("titleRef");
const textRef = useTemplateRef("textRef");
const availabilityRef = useTemplateRef("availabilityRef");

const animate = () => {
	$splitText.create(titleRef.value, {
		type: "lines",
		onSplit: (self) => {
			$gsap.from(self.lines, {
				x: -100,
				autoAlpha: 0,
			});
		},
	});
	$splitText.create(textRef.value, {
		type: "lines",
		onSplit: (self) => {
			$gsap.from(self.lines, {
				x: -100,
				autoAlpha: 0,
			});
		},
	});

	if (availabilityRef.value) {
		$gsap.from(availabilityRef.value.querySelectorAll("[data-reveal]"), {
			y: 24,
			autoAlpha: 0,
			stagger: 0.08,
			duration: 0.6,
			delay: 0.4,
			ease: "power2.out",
		});
	}
};

const { whenReady } = usePreloader();

onMounted(() => {
	whenReady(() => nextTick(animate));
});
</script>

<template>
	<section :class="$style.HomeHero">
		<div :class="$style.bg">
			<FluidBg
				:colors="['#2b6bff', '#83a4d5', '#5086d6']"
				:count="3"
				:speed="0.2"
				:amplitude="0.9"
				:waviness="1.7"
				:thickness="0.7"
				:glow="0.75"
				:taper="1.5"
				:spread="1.1"
				:intensity="0.2"
				:saturation="1.7"
				:opacity="1"
				:scale="1.5"
				:glass="false"
				:refraction="1"
				:dispersion="0.85"
				:glass-size="1"
			/>
		</div>

		<div :class="[$style.content, 'container']">
			<div :class="$style.main">
				<h1
					v-if="props.content.title"
					ref="titleRef"
					:class="$style.title"
					v-html="props.content.title"
				/>
				<div
					v-if="props.content.subtitle"
					ref="textRef"
					:class="$style.subtitle"
					v-html="props.content.subtitle"
				/>
			</div>

			<div
				v-if="props.availability"
				ref="availabilityRef"
				:class="$style.availability"
			>
				<p
					v-if="props.availability.status"
					data-reveal
					:class="$style.badge"
				>
					<span :class="$style.dot" aria-hidden="true" />
					{{ props.availability.status }}
				</p>

				<ul
					v-if="props.availability.facts?.length"
					:class="$style.facts"
				>
					<li
						v-for="(fact, ind) in props.availability.facts"
						:key="`fact_${ind}`"
						data-reveal
						:class="$style.fact"
					>
						<span :class="$style.bullet" aria-hidden="true" />
						{{ fact }}
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<style lang="scss" module>
.HomeHero {
	min-height: 100vh;
	color: $white;
	background: #000;
	display: flex;
	position: relative;
	overflow: hidden;
}

.bg {
	position: absolute;
	inset: 0;
	z-index: 0;
}

.content {
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 2;
	padding: 4rem 6rem 6rem;
	flex: 1;

	@include media($mobile) {
		padding: 4rem 2rem;
	}
}

.main {
	display: flex;
	flex-direction: column;
	justify-content: center;
	flex: 1;
}

.title {
	font-family: $ff-title;
	font-size: 7.2rem;
	line-height: 1.1;
	text-transform: uppercase;
	color: $white;

	@include media($mobile) {
		font-size: 5.2rem;
	}
}

.subtitle {
	font-size: 2rem;
	line-height: 1.6;
	color: $gray6;
}

// блок прижат к низу hero: горизонтальные отступы задаёт контейнер,
// сверху — только страховочная отбивка от заголовка
.availability {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 2.4rem;
	margin-top: 4.8rem;
	flex-shrink: 0;

	@include media($mobile) {
		margin-top: 3.2rem;
		gap: 1.8rem;
	}
}

.badge {
	display: inline-flex;
	align-items: center;
	gap: 1.2rem;
	padding: 1.2rem 2.4rem;
	border-radius: 10rem;
	background: $accent;
	color: $white;
	font-size: 1.5rem;
	line-height: 1.2;
	box-shadow: 0 0 3.6rem $accent-glow;

	@include media($mobile) {
		font-size: 1.4rem;
		padding: 1rem 1.8rem;
		align-items: flex-start;
	}
}

.dot {
	width: 0.8rem;
	height: 0.8rem;
	flex-shrink: 0;
	border-radius: 50%;
	background: $white;
	box-shadow: 0 0 1rem rgba($white, 0.9);
	animation: pulse 2.4s ease-in-out infinite;

	@include media($mobile) {
		margin-top: 0.4rem;
	}
}

@keyframes pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.3;
	}
}

.facts {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem 3.2rem;

	@include media($mobile) {
		gap: 1rem 2rem;
	}
}

.fact {
	display: inline-flex;
	align-items: center;
	gap: 0.9rem;
	font-size: 1.4rem;
	color: $gray5;

	@include media($mobile) {
		font-size: 1.3rem;
	}
}

.bullet {
	width: 0.5rem;
	height: 0.5rem;
	flex-shrink: 0;
	border-radius: 50%;
	background: $accent;
	box-shadow: 0 0 0.9rem $accent-glow;
}
</style>

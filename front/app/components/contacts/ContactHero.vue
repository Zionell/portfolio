<script setup lang="ts">
import type { ContactsHero } from "~~/generated/prisma/client";

const props = defineProps<{
	data: ContactsHero;
}>();

const $style = useCssModule();
const { $gsap, $splitText } = useNuxtApp();
const supTitle = useTemplateRef<HTMLElement>("supTitle");
const titleRef = useTemplateRef<HTMLElement>("titleRef");
const textRef = useTemplateRef<HTMLElement>("textRef");
const metaItemRefFirst = useTemplateRef<HTMLElement>("metaItemRefFirst");
const metaItemRefSecond = useTemplateRef<HTMLElement>("metaItemRefSecond");

const textAnimation = (el: HTMLElement) => {
	$splitText.create(el, {
		type: "chars",
		onSplit: (self) => {
			$gsap.from(self.chars, {
				x: -100,
				autoAlpha: 0,
				stagger: {
					from: "random",
					amount: 0.5,
				},
			});
		},
	});
};

const metaAnimation = (el: HTMLElement) => {
	const tl = $gsap.timeline();

	const line = el.querySelector<HTMLElement>(`.${$style.line}`);

	tl.from(line, {
		duration: 1.5,
		width: 0,
		autoAlpha: 0,
		ease: "power2.out",
	});

	$splitText.create(el, {
		type: "chars",
		onSplit: (self) => {
			tl.from(self.chars, {
				y: -100,
				autoAlpha: 0,
				stagger: {
					from: "random",
					amount: 0.5,
				},
			});
		},
	});
};

const animate = () => {
	if (supTitle.value) {
		textAnimation(supTitle.value);
	}
	if (titleRef.value) {
		textAnimation(titleRef.value);
	}
	if (textRef.value) {
		textAnimation(textRef.value);
	}
	if (metaItemRefFirst.value) {
		metaAnimation(metaItemRefFirst.value);
	}
	if (metaItemRefSecond.value) {
		metaAnimation(metaItemRefSecond.value);
	}
};

onMounted(() => {
	nextTick(animate);
});
</script>

<template>
	<section :class="$style.ContactHero">
		<div :class="$style.heroContent">
			<p ref="supTitle" :class="$style.supTitle">ASKAROV.DEV</p>
			<h1 v-if="props.data?.title" ref="titleRef" :class="$style.title">
				{{ props.data.title }}
			</h1>
			<div
				v-if="props.data?.subTitle"
				ref="textRef"
				:class="$style.subtitle"
				v-html="props.data.subTitle"
			/>

			<div :class="$style.heroMeta">
				<div
					v-if="props.data?.location"
					ref="metaItemRefFirst"
					:class="$style.metaItem"
				>
					<span :class="$style.line"></span>
					<span>Location</span>
					<strong>{{ props.data.location }}</strong>
				</div>
				<div
					v-if="props.data?.focus?.length"
					ref="metaItemRefSecond"
					:class="$style.metaItem"
				>
					<span :class="$style.line"></span>
					<span>Work focus</span>
					<ul :class="$style.focusList">
						<li v-for="item in props.data.focus" :key="item">
							{{ item }}
						</li>
					</ul>
				</div>
			</div>

			<VButton
				v-if="props.data?.cvLink"
				:label="$t('common.getCv')"
				:href="props.data.cvLink"
				:download="props.data?.cvFileName || 'Adilkhan_Askarov_CV.pdf'"
				:aria-label="$t('common.getCv')"
			/>
		</div>
	</section>
</template>

<style module lang="scss">
.ContactHero {
	min-height: 100vh;
	display: flex;
	align-items: center;
	padding: 16rem 6rem 8rem;
	color: $white;
	background:
		linear-gradient(120deg, rgba(255, 255, 255, 0.1), transparent 36%),
		radial-gradient(circle at 78% 18%, rgba($gray3, 0.38), transparent 30%),
		$black;
	overflow: hidden;
}

.heroContent {
	width: min(100%, 86rem);
	display: grid;
	gap: 2.4rem;
}

.supTitle {
	font-size: 1.3rem;
	line-height: 1.4;
	letter-spacing: 0.16em;
	color: $gray4;
	text-transform: uppercase;
}

.title {
	font-family: $ff-title;
	font-size: 7.2rem;
	line-height: 1.05;
	text-transform: uppercase;
}

.subtitle {
	max-width: 68rem;
	font-size: 2rem;
	line-height: 1.6;
	color: $gray5;
}

.heroMeta {
	display: flex;
	flex-wrap: wrap;
	gap: 1.6rem;
	max-width: 98rem;
	margin-top: 2.4rem;
}

.metaItem {
	overflow: hidden;
	display: grid;
	gap: 0.8rem;
	margin-top: 1.6rem;

	span {
		font-size: 1.1rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: $gray4;
	}

	strong {
		font-size: 1.4rem;
		line-height: 1.5;
		color: $white;
		font-weight: 400;
	}
}

.line {
	display: block;
	width: 100%;
	height: 1px;
	background: rgba($gray1, 0.6);
}

.focusList {
	display: flex;
	gap: 1.6rem;
	margin-top: 0.8rem;

	li {
		font-size: 1.4rem;
		line-height: 1.5;
		color: $white;
		font-weight: 400;
	}
}
</style>

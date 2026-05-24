<script setup lang="ts">
import type { IHomeExperience } from "#shared/types/home.types";
import { formatDate } from "~/assets/ts/utils";

const props = defineProps<{
	content: IHomeExperience[];
}>();

const { t, locale } = useI18n();

const period = (item: IHomeExperience): string => {
	const isPresent = item.isPresent;
	const start = item?.startDate ? formatDate(item.startDate, locale) : "";
	const end = isPresent
		? t("experience.present")
		: item?.endDate
			? formatDate(item.endDate, locale)
			: "";

	return `${start} - ${end}`;
};

const { $gsap } = useNuxtApp();
const itemRef = useTemplateRef("itemRef");

const animate = () => {
	const tl = $gsap.timeline();

	itemRef.value?.forEach((item, ind) => {
		tl.from(item, {
			scrollTrigger: {
				trigger: item,
				start: "top 80%",
				end: "top 60%",
				toggleActions: "play none resume reverse",
				scrub: true,
			},
			autoAlpha: 0,
			x: ind % 2 === 0 ? 100 : -100,
		});
	});
};

onMounted(() => {
	nextTick(animate);
});
</script>

<template>
	<TheSectionWrapper :title="$t('sections.experience')">
		<div v-if="props.content.length" :class="$style.HomeExperience">
			<article
				v-for="(item, ind) in props.content"
				:key="ind"
				ref="itemRef"
				:class="$style.card"
			>
				<div :class="$style.cardTop">
					<div>
						<p v-if="item.position" :class="$style.title">
							{{ item.position }}
						</p>
						<p v-if="item.company" :class="$style.subtitle">
							{{ item.company }}
						</p>
					</div>
					<span v-if="period(item)" :class="$style.period">
						{{ period(item) }}
					</span>
				</div>

				<ul v-if="item.stack?.length" :class="$style.stackList">
					<li
						v-for="(stack, i) in item.stack"
						:key="i"
						:class="$style.stack"
					>
						{{ stack }}
					</li>
				</ul>

				<div :class="$style.pointsTitle">
					{{ $t("experience.responsibilities") }}
				</div>
				<div
					v-if="item.responsibilities"
					:class="$style.points"
					v-html="item.responsibilities"
				/>
			</article>
		</div>
	</TheSectionWrapper>
</template>

<style lang="scss" module>
.HomeExperience {
	display: grid;
	gap: 2.4rem;
}

.card {
	padding: 2.4rem;
	border-radius: 1.6rem;
	border: 1px solid rgba(255, 255, 255, 0.08);
	background: rgba(255, 255, 255, 0.02);
	display: flex;
	flex-direction: column;
	gap: 1.6rem;
}

.cardTop {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 2rem;
	flex-wrap: wrap;
}

.title {
	font-size: 1.6rem;
	color: $white;
}

.subtitle {
	font-size: 1.4rem;
	color: $gray4;
}

.period {
	font-size: 1.2rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: $gray4;
}

.stackList {
	display: flex;
	flex-wrap: wrap;
	gap: 0.8rem;
}

.stack {
	font-size: 1.3rem;
	color: $gray4;
	display: flex;
	align-items: center;
	gap: 0.8rem;

	&:not(:last-child):after {
		content: "•";
	}
}

.pointsTitle {
	font-size: 1.6rem;
	color: $gray5;
}

.points {
	display: grid;
	gap: 0.6rem;
	font-size: 1.4rem;
	line-height: 1.6;
	color: $gray5;
	padding-left: 1.6rem;

	li {
		display: flex;
		gap: 0.4rem;
		align-items: center;

		&:before {
			content: "-";
		}
	}
}
</style>

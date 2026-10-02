<script setup lang="ts">
import type { IHomeExperience } from "#shared/types/home.types";
import { formatDate } from "~/assets/ts/utils";

const props = defineProps<{
	content: IHomeExperience[];
}>();

const { t, locale } = useI18n();

const period = (item: IHomeExperience): string => {
	const isPresent = item.isPresent;
	const start = item?.startDate
		? formatDate(item.startDate, locale.value)
		: "";
	const end = isPresent
		? t("experience.present")
		: item?.endDate
			? formatDate(item.endDate, locale.value)
			: "";

	return `${start} — ${end}`;
};

const num = (ind: number): string => String(ind + 1).padStart(2, "0");

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
	<TheSectionWrapper class="container" :title="$t('sections.experience')">
		<div v-if="props.content.length" :class="$style.HomeExperience">
			<article
				v-for="(item, ind) in props.content"
				:key="item.id ?? ind"
				ref="itemRef"
				:class="$style.row"
			>
				<p :class="$style.num">{{ num(ind) }}</p>

				<div>
					<h3 v-if="item.position" :class="$style.role">
						{{ item.position }}
					</h3>
					<p v-if="item.company" :class="$style.meta">
						{{ item.company }} · {{ period(item) }}
					</p>
				</div>

				<div>
					<div
						v-if="item.responsibilities"
						:class="$style.points"
						v-html="item.responsibilities"
					/>
					<p v-if="item.stack?.length" :class="$style.tech">
						{{ item.stack.join(" · ") }}
					</p>
				</div>
			</article>
		</div>
	</TheSectionWrapper>
</template>

<style lang="scss" module>
.HomeExperience {
	display: grid;
}

.row {
	display: grid;
	grid-template-columns:
		minmax(4.8rem, 7.2rem)
		minmax(0, 28rem)
		minmax(0, 1.6fr);
	gap: 1.8rem clamp(2rem, 3vw, 4.8rem);
	align-items: baseline;
	padding: 3.4rem 0;
	position: relative;

	&:before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			to right,
			transparent,
			rgba($accent, 0.35) 4.8rem calc(100% - 4.8rem),
			transparent
		);
	}

	// маятник по разделителю: блик ходит влево-вправо и не вылезает за края.
	// Сегмент занимает 24% строки, значит правым краем он упрётся в конец
	// строки, сдвинувшись на (100 - 24) / 24 ≈ 316% собственной ширины
	&:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 24%;
		height: 1px;
		background: linear-gradient(
			to right,
			transparent,
			$accent,
			transparent
		);
		box-shadow: 0 0 1.2rem $accent-glow;
		transform: translateX(0);
		animation: runner 5s ease-in-out infinite alternate;
		will-change: transform;
	}

	// блики соседних строк не должны идти строем
	&:nth-child(3n + 2):after {
		animation-delay: -2s;
	}

	&:nth-child(3n):after {
		animation-delay: -4s;
	}

	@media (prefers-reduced-motion: reduce) {
		&:after {
			animation: none;
			opacity: 0;
		}
	}

	@include media($mobile) {
		grid-template-columns: auto minmax(0, 1fr);

		> div:last-child {
			grid-column: 2;
		}
	}
}

@keyframes runner {
	from {
		transform: translateX(0);
	}

	to {
		transform: translateX(316.6%);
	}
}

.num {
	font-family: $ff-title;
	font-size: 1.6rem;
	color: $gray5;
}

.role {
	font-family: $ff-title;
	font-size: 2.2rem;
	line-height: 1.2;
	color: $white;
}

.meta {
	font-size: 1.4rem;
	color: $gray4;
	margin-top: 0.8rem;
}

.points {
	font-size: 1.6rem;
	line-height: 1.8;
	color: $gray5;
	max-width: 72ch;
	padding-left: 1.6rem;

	ul {
		display: grid;
		gap: 0.6rem;
	}

	li {
		display: flex;
		gap: 0.4rem;
		align-items: center;

		&:before {
			content: "-";
		}
	}
}

.tech {
	font-size: 1.2rem;
	letter-spacing: 0.04em;
	color: $gray4;
	margin-top: 1.4rem;
}
</style>

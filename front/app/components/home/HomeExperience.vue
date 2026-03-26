<script setup lang="ts">
import type { HomeExperience } from "~~/generated/prisma/client";

const props = defineProps<{
	content: HomeExperience[];
}>();
</script>

<template>
	<TheSectionWrapper :title="$t('sections.experience')">
		<div v-if="props.content.length" :class="$style.HomeExperience">
			<article
				v-for="(item, ind) in props.content"
				:key="ind"
				:class="$style.card"
			>
				<div :class="$style.cardTop">
					<div>
						<p v-if="item.company" :class="$style.company">
							{{ item.company }}
						</p>
						<p v-if="item.position" :class="$style.position">
							{{ item.position }}
						</p>
					</div>
					<span v-if="item.period" :class="$style.period">
						{{ item.period }}
					</span>
				</div>

				<p v-if="item.stack.length" :class="$style.stack">
					{{ item.stack.join(" · ") }}
				</p>

				<ul v-if="item.responsibilities.length" :class="$style.points">
					<li v-for="(point, i) in item.responsibilities" :key="i">
						{{ point }}
					</li>
				</ul>
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

.company {
	font-size: 1.6rem;
	color: $white;
}

.position {
	font-size: 1.4rem;
	color: $gray4;
}

.period {
	font-size: 1.2rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: $gray4;
}

.stack {
	font-size: 1.3rem;
	color: $gray4;
}

.points {
	display: grid;
	gap: 0.6rem;
	font-size: 1.4rem;
	line-height: 1.6;
	color: $gray5;
	padding-left: 1.6rem;
}
</style>

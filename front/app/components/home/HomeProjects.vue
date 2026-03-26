<script setup lang="ts">
import type { Project } from "~~/generated/prisma/client";

const props = defineProps<{
	content: Project[];
}>();
</script>

<template>
	<TheSectionWrapper :title="$t('sections.projects')">
		<div v-if="props.content.length" :class="$style.HomeProjects">
			<NuxtLink
				v-for="project in props.content"
				:key="project.slug"
				:class="$style.card"
				:to="project.link"
			>
				<NuxtImg
					:class="$style.cardImg"
					:src="`/images/projects/${project.slug}.jpg`"
					:alt="project.name"
					placeholder
				/>

				<div :class="$style.cardBody">
					<p :class="$style.cardTitle">{{ project.name }}</p>
					<p v-if="project.stack.length" :class="$style.cardMeta">
						{{ project.stack.slice(0, 4).join(" · ") }}
					</p>
				</div>
			</NuxtLink>
		</div>
	</TheSectionWrapper>
</template>

<style lang="scss" module>
.HomeProjects {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 2rem;

	@include media($tablet) {
		grid-template-columns: repeat(2, 1fr);
	}

	@include media($mobile) {
		grid-template-columns: 1fr;
	}
}

.card {
	position: relative;
	overflow: hidden;
	border-radius: 1.2rem;
	transition: $default-transition;
	display: grid;
	height: 26rem;

	&:after {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(0, 0, 0, 0),
			rgba(0, 0, 0, 0.9)
		);
		z-index: 1;
	}

	@include hover {
		transform: translateY(-10px);

		.cardImg {
			transform: scale(1.08);
			filter: brightness(0.9) saturate(1.1) contrast(1.05);
		}
	}
}

.cardImg {
	position: relative;
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: $default-transition;
	z-index: 0;
}

.cardBody {
	position: absolute;
	inset: 0;
	padding: 1.6rem;
	z-index: 3;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.cardTitle {
	font-size: 1.4rem;
	color: $white;
}

.cardMeta {
	font-size: 1rem;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: rgba(255, 255, 255, 0.6);
}
</style>

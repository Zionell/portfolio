<script setup lang="ts">
import type { IHomeProject } from "#shared/types/home.types";

const props = defineProps<{
	content: IHomeProject[];
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
					:src="project.image"
					:alt="project.name"
					placeholder
				/>

				<div :class="$style.cardBody">
					<p :class="$style.cardTitle">{{ project.name }}</p>
					<ul v-if="project.stack?.length" :class="$style.stackList">
						<li
							v-for="(stack, i) in project.stack"
							:key="i"
							:class="$style.stack"
						>
							{{ stack.label }}
						</li>
					</ul>
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

		.stackList {
			animation: showStack 3s ease-out forwards;
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

.stackList {
	padding-top: 1.2rem;
	display: flex;
	flex-wrap: wrap;
	gap: 0.8rem;
	height: 0;
	transform: translateY(100%);
	transform-origin: bottom;
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

@keyframes showStack {
	0% {
		height: 0;
		transform: translateY(100%);
	}

	1% {
		height: auto;
		transform: translateY(99%);
	}

	100% {
		height: auto;
		transform: translateY(0);
	}
}
</style>

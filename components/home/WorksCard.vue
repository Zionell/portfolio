<script setup lang="ts">
import type { IWorkCard } from "assets/interfaces/interface";

const props = defineProps<{
	card: IWorkCard;
}>();

const imageSrc = computed(() => {
	return `/images/projects/${props.card.slug}.jpg`;
});

const toProject = (): void => {
	if (props.card.isArchived) {
		return;
	}
	window.open(props.card.link, "_blank");
};
</script>

<template>
	<div
		:class="[
			$style.HomeWorksCard,
			{ [$style._isArchived]: card.isArchived },
		]"
		@click="toProject"
	>
		<div :class="$style.cardImageWrap">
			<NuxtImg
				v-if="imageSrc"
				:class="$style.cardImage"
				:alt="card.name"
				:src="imageSrc"
				loading="lazy"
				:modifiers="{
					format: 'webp',
				}"
				placeholder
			/>
			<div v-else :class="$style.empty">&#8826; NOT FOUND &#8827;</div>
		</div>
		<h5 :class="$style.cardProjectName">{{ card.name }}</h5>
		<div v-if="card.isDeveloping" :class="$style.tag">Developing</div>
		<div v-if="card.isArchived" :class="$style.tag">Archived</div>
		<div :class="$style.cardStackWrap">
			<p :class="$style.cardStackTitle">Stack:</p>
			<div :class="$style.cardStackItems">
				<VIcon
					v-for="(s, ind) in card.stack"
					:key="ind"
					size="big"
					:name="s"
				/>
			</div>
		</div>
		<a :class="$style.cardLink" :href="card.link" target="_blank" />
	</div>
</template>

<style lang="scss" module>
.HomeWorksCard {
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 36rem;
	padding: 2.4rem;
	border-radius: 1rem;
	cursor: pointer;
	user-select: none;

	&._isArchived {
		cursor: not-allowed;

		.tag {
			background: #ff7300;
		}
	}

	@include hover {
		.cardImageWrap {
			filter: brightness(0.2);
		}

		.cardProjectName,
		.cardStackWrap,
		.tag {
			opacity: 1;
		}
	}

	@include respond-to(mobile) {
		height: 20rem;
	}
}

.cardImageWrap {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 0;
	background: $gray3;
	transition: $default-transition;
	user-select: none;
}

.cardImage {
	width: 100%;
	height: 100%;
}

.empty {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	font-size: 2.4rem;
	font-weight: 700;
}

.cardProjectName {
	position: relative;
	z-index: 2;
	padding-bottom: 1.6rem;
	font-size: 2.4rem;
	font-weight: 700;
	color: $white;
	opacity: 0;
	transition: $default-transition;
}

.cardStackWrap {
	position: relative;
	z-index: 2;
	opacity: 0;
	transition: $default-transition;
}

.cardStackTitle {
	padding-bottom: 1.6rem;
	font-size: 1.6rem;
	color: $white;
}

.cardStackItems {
	display: flex;
	gap: 0.8rem;
}

.tag {
	position: relative;
	z-index: 2;
	margin-bottom: 0.8rem;
	padding: 0.8rem 1.6rem;
	width: fit-content;
	border-radius: 0.8rem;
	background: red;
	color: white;
	font-size: 1.4rem;
	opacity: 0;
}
</style>

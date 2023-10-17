<script
	setup
	lang="ts"
>

import {PropType} from "@vue/runtime-core";
import {IWorkCard} from "assets/interfaces/interface";
import {useDevice} from "#imports";
import {Device} from "@nuxtjs/device/dist/runtime/types";

const {isMobile} = <Device>useDevice()

const props = defineProps({
	card: {
		type: Object as PropType<IWorkCard>,
		default: () => ({})
	}
})

function toProject(): void {
	if (isMobile) {
		window.open(props.card.link);
	}
};
</script>

<template>
	<div
		:class="$style.HomeWorksCard"
		@click="toProject"
	>
		<div :class="$style.cardImageWrap">
			<NuxtImg
				:class="$style.cardImage"
				:alt="card.name"
				:src="card.imageSrc"
				:modifiers="{
					format: 'webp'
				}"
				placeholder
			/>
		</div>
		<h5 :class="$style.cardProjectName">{{ card.name }}</h5>
		<div :class="$style.cardStackWrap">
			<p :class="$style.cardStackTitle">Stack:</p>
			<div :class="$style.cardStackItems">
				<UiVIcon
					v-for="(s, ind) in card.stack"
					:key="ind"
					size="big"
					:name="s"
				/>
			</div>
		</div>
		<a
			:class="$style.cardLink"
			:href="card.link"
			target="_blank"
		>
			go
		</a>
	</div>
</template>

<style
	lang="scss"
	module
>
	.HomeWorksCard {
		position: relative;
		overflow: hidden;
		width: 100%;
		height: 36rem;
		padding: 2.4rem;
		border-radius: 1rem;

		@include hover {
			.cardImageWrap {
				filter: brightness(.2);
			}

			.cardProjectName,
			.cardStackWrap {
				opacity: 1;
			}

			.cardLink {
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
		transition: $default-transition;
	}

	.cardImage {
		width: 100%;
		height: 100%;
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
		gap: .8rem;
	}

	.cardLink {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		z-index: 2;
		opacity: 0;
		padding: .6rem 2rem;
		border-radius: 50px;
		background: rgba(0, 0, 0, .7);
		text-transform: uppercase;
		font-size: 1.8rem;
		color: $gray5;
		transition: $default-transition;
		box-shadow: 0 0 3px $white;
		user-select: none;

		@include hover {
			background: $white;
			color: $black;
		}
	}
</style>

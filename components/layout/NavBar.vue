<script
	setup
	lang="ts"
>
import {gsap} from "gsap";
import type {HtmlType} from "~/assets/types";
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';
import {useMenuStore} from "~/store/menu";
import {useDevice} from "#imports";
import type {Device} from "@nuxtjs/device/dist/runtime/types";

gsap.registerPlugin(ScrollToPlugin);

const {isMobile} = <Device>useDevice()
const {$state} = useMenuStore();
const isOpen = ref<boolean>(true);
const cursor = ref<HtmlType>(null);

const openMenu = (): void => {
	if (isMobile) {
		if (isOpen.value) {
			gsap.to('#burgerBottom', {
				duration: .3,
				width: '30px',
				rotate: 30,
			});
			gsap.to('#burgerTop', {
				duration: .3,
				rotate: -30,
			});
			gsap.to('#menuList', {
				duration: .3,
				translateX: 0,
			});
		} else {
			gsap.to('#burgerBottom', {
				duration: .3,
				width: '15px',
				rotate: 0,
			});
			gsap.to('#burgerTop', {
				duration: .3,
				rotate: 0,
			});
			gsap.to('#menuList', {
				duration: .3,
				translateX: '100%',
			});
		}

		isOpen.value = !isOpen.value
	}
};

const scrollTo = (path: string): void => {
	gsap.to(window, {duration: 1, scrollTo: `#${path}`});
};
</script>

<template>
	<nav :class="$style.NavBar">
		<div
			:class="$style.cursor"
			ref="cursor"
		/>
		<button
			:class="$style.burgerWrap"
			@click="openMenu"
		>
			<span
				id="burgerTop"
				:class="$style.burgerTop"
			/>
			<span
				id="burgerBottom"
				:class="$style.burgerBottom"
			/>
		</button>
		<ul
			id="menuList"
			:class="$style.navList"
		>
			<li
				v-for="(link, ind) in $state"
				:key="ind"
				@click="openMenu"
			>
				<button
					:class="$style.navLink"
					@click="scrollTo(link.value)"
				>
					{{ link.label }}
				</button>
			</li>
		</ul>
	</nav>
</template>

<style
	lang="scss"
	module
>
	.NavBar {
		position: fixed;
		top: 0;
		right: 0;
		left: 13rem;
		z-index: 9;
		padding: 3.2rem 5.6rem;
		background: $background-gradient;

		@include respond-to(mobile) {
			left: 0;
			padding: 2.4rem 4rem;
		}
	}

	.cursor {
		position: fixed;
		opacity: 0;
		display: none;
		width: 5rem;
		height: 5rem;
		border-radius: 50%;
		background: $white;
		mix-blend-mode: color-dodge;
		transform: translate(-50%, -50%);
		transition: opacity $default-transition;
	}

	.burgerWrap {
		position: relative;
		z-index: 10;
		display: none;
		margin-left: auto;
		flex-direction: column;
		align-items: flex-end;
		width: 3rem;
		height: 1.5rem;
		justify-content: space-between;

		@include respond-to(mobile) {
			display: flex;
		}
	}

	.burgerTop,
	.burgerBottom {
		content: "";
		display: flex;
		height: 3px;
		background: #939598;
	}

	.burgerTop {
		width: 3rem;
		transform-origin: 25px 0;
	}

	.burgerBottom {
		width: 1.5rem;
		transform-origin: right;
	}

	.navList {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 5.6rem;

		@include respond-to(mobile) {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			justify-content: center;
			flex-direction: column;
			padding: 10rem;
			background: $gray3;
			transform: translateX(100%);
		}
	}

	.navLink {
		position: relative;
		text-transform: uppercase;
		font-size: 1.6rem;
		font-weight: 700;
		line-height: 2rem;
		color: $gray5;
		transition: $default-transition;
		user-select: none;

		&:after {
			content: "";
			position: absolute;
			bottom: -.4rem;
			display: block;
			width: 0;
			height: .3rem;
			background: $gray3;
			transition: $default-transition;
		}

		&:hover {
			color: $gray3;

			&:after {
				width: 100%;
			}
		}

		&:global(.active) {
			color: $gray3;

			&:after {
				width: 100%;
			}
		}

		@include respond-to(mobile) {
			font-size: 2.6rem;
			line-height: 3rem;
			color: $black;

			&:global(.active) {
				color: $white;
			}
		}
	}
</style>

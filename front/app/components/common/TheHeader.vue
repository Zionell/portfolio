<script setup lang="ts">
import { menu } from "~/assets/data/menu";

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const headerEl = ref<HTMLElement | null>(null);

const onScroll = () => {
	isScrolled.value = window.scrollY > 8;
};

onMounted(() => {
	onScroll();
	window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
	window.removeEventListener("scroll", onScroll);
});
</script>

<template>
	<header
		ref="headerEl"
		:class="[$style.TheHeader, { [$style._scrolled]: isScrolled }]"
	>
		<div :class="$style.container">
			<TheBurger :is-active="isMenuOpen" @click="isMenuOpen = $event" />

			<TheLogo :class="$style.brand" />

			<div :class="$style.actions">
				<VButton :label="$t('common.getCv')" />
				<TheLanguageSelect />
			</div>
		</div>

		<Transition name="menu" mode="out-in" appear>
			<nav v-if="isMenuOpen" :class="$style.drawer">
				<NuxtLink
					v-for="item in menu"
					:key="item.value"
					:class="$style.drawerLink"
					:to="item.value"
					@click="isMenuOpen = false"
				>
					{{ $t(`sections.${item.key}`) }}
				</NuxtLink>
			</nav>
		</Transition>
	</header>
</template>

<style lang="scss" module>
.TheHeader {
	position: fixed;
	top: 2.4rem;
	width: 80vw;
	z-index: 10;
	transition: $default-transition;
	left: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	transform: translateX(-50%);

	&._scrolled {
		top: 0;

		.container {
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
			border-radius: 0 0 2rem 2rem;
		}

		@include media($mobile) {
			top: 0;
		}
	}
}

.container {
	position: relative;
	z-index: 2;
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	padding: 1.6rem 2.4rem;
	width: 100%;
	background: rgba($gray5, 0.15);
	backdrop-filter: blur(20px);
	border-radius: 2rem;
}

.brand {
	justify-self: center;
	display: flex;
	align-items: center;
}

.actions {
	display: flex;
	align-items: center;
	gap: 2.4rem;
	justify-self: end;
}

.drawer {
	position: absolute;
	top: 100%;
	width: 80%;
	padding: 2.4rem;
	z-index: 1;
	display: flex;
	flex-wrap: wrap;
	gap: 2.4rem;
	background: rgba($gray5, 0.15);
	backdrop-filter: blur(20px);
	border-radius: 0 0 2rem 2rem;

	@include media($mobile) {
		width: calc(100% - 3.2rem);
	}
}

.drawerLink {
	position: relative;
	font-size: 1.4rem;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: $white;

	&:after {
		content: "";
		position: absolute;
		bottom: -0.4rem;
		left: 0;
		width: 100%;
		height: 0.1rem;
		background: $white;
		transform: scaleX(0);
		transform-origin: left;
		transition: $default-transition;
	}

	@include hover {
		&:after {
			transform: scaleX(1);
		}
	}
}
</style>

<script setup lang="ts">
import { menu } from "~/assets/data/menu";
import type { ISettings } from "#shared/types/settings.types";

const props = defineProps<{
	settings: ISettings | undefined;
}>();

const currentYear = new Date().getFullYear();
</script>

<template>
	<footer :class="[$style.RedesignFooter, 'container']">
		<div :class="$style.line" />

		<div :class="$style.content">
			<TheLogo :class="$style.logo" />

			<nav :class="$style.nav">
				<NuxtLink
					v-for="item in menu"
					:key="item.value"
					:class="$style.navLink"
					:to="item.value"
				>
					{{ $t(`sections.${item.key}`) }}
				</NuxtLink>
			</nav>

			<div v-if="props.settings?.contacts" :class="$style.contacts">
				<NuxtLink
					v-for="item in props.settings.contacts"
					:key="item.id"
					:class="$style.navLink"
					:to="item.link"
					target="_blank"
				>
					{{ item.name }}
				</NuxtLink>
			</div>
		</div>

		<p :class="$style.copy">
			© {{ currentYear }} ASKAROV.DEV. All Rights Reserved.
		</p>
	</footer>
</template>

<style lang="scss" module>
.RedesignFooter {
	padding: 6rem;
	display: flex;
	flex-direction: column;
	gap: 3.2rem;
	color: $white;
	align-items: center;

	@include media($mobile) {
		padding: 6rem 2rem;
	}
}

.line {
	width: 100%;
	height: 1px;
	background: rgba(255, 255, 255, 0.1);
}

.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 3.2rem;
	text-align: center;

	@include media($mobile) {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2.4rem;
		text-align: left;
		width: 100%;
	}
}

.logo {
	@include media($mobile) {
		grid-column: 1 / -1;
	}
}

.nav {
	display: flex;
	justify-content: center;
	gap: 2.4rem;
	flex-wrap: wrap;

	@include media($mobile) {
		gap: 1.6rem;
		flex-direction: column;
		align-items: flex-start;
	}
}

.navLink {
	position: relative;
	font-size: 1.4rem;
	color: $gray4;

	&:after {
		content: "";
		position: absolute;
		bottom: -0.4rem;
		left: 0;
		width: 100%;
		height: 0.1rem;
		background: $gray4;
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

.contacts {
	display: flex;
	justify-content: center;
	gap: 2.4rem;
	flex-wrap: wrap;

	@include media($mobile) {
		gap: 1.6rem;
		flex-direction: column;
		align-items: flex-start;
	}
}

.contactLink {
	color: $gray4;
	font-size: 1.4rem;
	transition: $default-transition;

	@include hover {
		color: $white;
	}
}

.copy {
	font-size: 1.2rem;
	color: $gray4;
	text-align: center;
}
</style>

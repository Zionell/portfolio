<script setup lang="ts">
import { menu } from "~/assets/data/menu";
import type { ISettings } from "#shared/types/settings.types";

const props = defineProps<{
	settings: ISettings | undefined;
}>();

const isRouteLink = (value: string) => value.startsWith("/");

const currentYear = new Date().getFullYear();
</script>

<template>
	<footer :class="[$style.RedesignFooter, 'container']">
		<div :class="$style.line" />

		<div :class="$style.content">
			<TheLogo />

			<nav :class="$style.nav">
				<NuxtLink
					v-for="item in menu"
					:key="item.value"
					:class="$style.navLink"
					:to="isRouteLink(item.value) ? item.value : undefined"
					:href="
						isRouteLink(item.value) ? undefined : `#${item.value}`
					"
				>
					{{ item.label }}
				</NuxtLink>
			</nav>

			<div :class="$style.contacts">
				<a
					v-if="props.settings?.contacts?.email"
					:class="$style.contactLink"
					:href="`mailto:${props.settings.contacts.email}`"
				>
					{{ props.settings.contacts.email }}
				</a>
				<a
					v-if="props.settings?.contacts?.phone"
					:class="$style.contactLink"
					:href="`tel:${props.settings.contacts.phone}`"
				>
					{{ props.settings.contacts.phone }}
				</a>
			</div>

			<div
				v-if="props.settings?.contacts?.social"
				:class="$style.socials"
			>
				<a
					v-for="item in props.settings.contacts.social"
					:key="item.name"
					:href="item.link"
					target="_blank"
					rel="noreferrer"
					:class="$style.social"
				>
					<div :class="$style.socialIcon" v-html="item.icon" />
				</a>
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

	//@media #{$mobile} {
	//	padding: 4rem 2.4rem;
	//}
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

	//@media #{$tablet} {
	//	gap: 2.4rem;
	//}
}

.nav {
	display: flex;
	justify-content: center;
	gap: 2.4rem;
	flex-wrap: wrap;
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
}

.contactLink {
	color: $gray4;
	font-size: 1.4rem;
	transition: $default-transition;

	@include hover {
		color: $white;
	}
}

.socials {
	display: flex;
	justify-content: center;
	gap: 1.6rem;
	flex-wrap: wrap;
}

.social {
	color: $gray4;
	transition: $default-transition;

	@include hover {
		color: $white;
	}
}

.socialIcon {
	width: 4rem;
	height: 4rem;
}

.copy {
	font-size: 1.2rem;
	color: $gray4;
	text-align: center;
}
</style>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import type { Locale } from "#i18n-kit/types";

const { locale, locales, setLocale } = useI18n();

const isOpen = ref(false);

const toggle = () => {
	isOpen.value = !isOpen.value;
};

const handleChange = async (code: Locale) => {
	await setLocale(code);
	window?.location?.reload();
};

const targetRef = useTemplateRef("targetRef");

onClickOutside(targetRef, () => (isOpen.value = false));
</script>

<template>
	<div
		ref="targetRef"
		:class="[$style.TheLanguageSelect, { [$style._open]: isOpen }]"
	>
		<button
			:class="$style.trigger"
			type="button"
			aria-haspopup="listbox"
			:aria-expanded="isOpen"
			@click="toggle"
		>
			<span>{{ locale }}</span>
		</button>

		<transition name="menu" mode="out-in">
			<div v-if="isOpen" :class="$style.menu" role="listbox">
				<button
					v-for="opt in locales"
					:key="opt.code"
					:class="[
						$style.item,
						{ [$style._active]: opt.code === locale },
					]"
					type="button"
					role="option"
					@click="handleChange(opt.code)"
				>
					{{ opt.name }}
				</button>
			</div>
		</transition>
	</div>
</template>

<style lang="scss" module>
.TheLanguageSelect {
	position: relative;

	&._open {
		.trigger {
			color: $white;
		}
	}
}

.trigger {
	display: inline-flex;
	align-items: center;
	font-size: 1.1rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: $gray4;
	transition: $default-transition;

	@include hover {
		color: $white;
	}
}

.menu {
	position: absolute;
	top: calc(100% + 0.6rem);
	right: 0;
	min-width: 7rem;
	background: rgba(0, 0, 0, 0.85);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 0.8rem;
	padding: 0.4rem;
	display: grid;
	gap: 0.2rem;
	backdrop-filter: blur(10px);
	z-index: 20;
}

.item {
	padding: 0.6rem 0.8rem;
	border-radius: 0.6rem;
	font-size: 1.1rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: $gray4;
	text-align: center;
	transition: $default-transition;
}

._active {
	color: $white;
	background: rgba(255, 255, 255, 0.08);
}
</style>

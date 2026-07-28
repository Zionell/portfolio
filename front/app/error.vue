<script setup lang="ts">
import type { NuxtError } from "#app";
import VButton from "~/components/ui/button/VButton.vue";

const props = defineProps({
	error: Object as () => NuxtError,
});

const { t } = useI18n();

const isNotFound = computed(() => Number(props.error?.statusCode) === 404);

const title = computed(() =>
	isNotFound.value ? t("error.titleNotFound") : t("error.title"),
);

const description = computed(() =>
	isNotFound.value ? t("error.descriptionNotFound") : t("error.description"),
);

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
	<main :class="$style.TheError">
		<div :class="[$style.inner, 'container']">
			<div :class="$style.text">
				<span :class="$style.code">{{ props.error?.statusCode }}</span>
				<h1 :class="$style.title">{{ title }}</h1>
				<p :class="$style.description">{{ description }}</p>

				<VButton
					:class="$style.button"
					:label="$t('error.back')"
					@click="handleError"
				>
					<template #icon>
						<span aria-hidden="true">←</span>
					</template>
				</VButton>
			</div>

			<div :class="$style.media">
				<NuxtImg
					:class="$style.image"
					src="/images/error-404.svg"
					alt="title"
					aria-hidden="true"
				/>
			</div>
		</div>
	</main>
</template>

<style lang="scss" module>
.TheError {
	display: flex;
	align-items: center;
	min-height: 100vh;
	padding: 8rem 6rem;
	background: $black;

	@include media($mobile) {
		padding: 6rem 2rem;
	}
}

.inner {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
	align-items: center;
	gap: 6rem;

	@include media($tablet) {
		grid-template-columns: minmax(0, 1fr);
		gap: 4rem;
	}
}

.text {
	display: flex;
	flex-direction: column;
	align-items: flex-start;

	@include media($tablet) {
		order: 2;
	}
}

.code {
	font-size: 2.4rem;
	font-family: $ff-title;
	letter-spacing: 0.4em;
	text-transform: uppercase;
	color: $gray4;
}

.title {
	margin-top: 1.6rem;
	font-family: $ff-title;
	font-size: 7.2rem;
	line-height: 1.1;
	letter-spacing: 0.02em;

	@include media($mobile) {
		font-size: 4.8rem;
	}
}

.description {
	margin-top: 2rem;
	max-width: 42rem;
	font-size: 1.6rem;
	line-height: 1.6;
	color: $gray5;
}

.button {
	margin-top: 4rem;
}

.media {
	display: flex;
	justify-content: center;

	@include media($tablet) {
		order: 1;
	}
}

.image {
	width: 100%;
	max-width: 64rem;
	height: auto;
}
</style>

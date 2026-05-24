<script setup lang="ts">
import type { IContactFormPayload } from "#shared/types/contact.types";
import { api } from "~/assets/data/api";

const props = defineProps<{
	data: ISettings["contacts"];
}>();

type SocialLinkRef = HTMLElement | { $el: HTMLElement };
type PopupTimer = ReturnType<typeof setInterval> | null;
type PopupCloseTimer = ReturnType<typeof setTimeout> | null;

const EMAIL_REGEXP = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;
const POPUP_AUTO_CLOSE_SECONDS = 5;
const POPUP_CLOSE_ANIMATION_MS = 550;

const isLoading = ref<boolean>(false);
const isSuccess = ref<boolean>(false);
const isError = ref<boolean>(false);
const isPopupClosing = ref<boolean>(false);
const popupAutoCloseSeconds = ref<number>(POPUP_AUTO_CLOSE_SECONDS);
const popupTimer = ref<PopupTimer>(null);
const popupCloseTimer = ref<PopupCloseTimer>(null);
const isPopupOpen = computed(() => isSuccess.value || isError.value);
const $style = useCssModule();
const { $gsap } = useNuxtApp();
const wrapperRef = useTemplateRef<HTMLElement>("wrapperRef");
const socialRef = useTemplateRef<SocialLinkRef[]>("socialRef");

const form = reactive<IContactFormPayload>({
	name: "",
	email: "",
	message: "",
});

const isEmailValid = computed(() => EMAIL_REGEXP.test(form.email.trim()));

const isFormReady = computed(() => {
	return Boolean(
		form.name.trim() &&
		isEmailValid.value &&
		form.message.trim() &&
		!isLoading.value,
	);
});

const handleSubmit = async () => {
	if (!isFormReady.value) {
		return;
	}

	isLoading.value = true;
	clearPopupTimer();
	clearPopupCloseTimer();
	isSuccess.value = false;
	isError.value = false;
	isPopupClosing.value = false;

	try {
		await $fetch(api.contactsForm, {
			method: "POST",
			body: {
				name: form.name.trim(),
				email: form.email.trim(),
				message: form.message.trim(),
			},
		});

		form.name = "";
		form.email = "";
		form.message = "";
		isSuccess.value = true;
	} catch (error) {
		isError.value = true;
		console.error("Failed to send message", error);
	} finally {
		isLoading.value = false;
	}
};

const closePopup = () => {
	if (!isPopupOpen.value || isPopupClosing.value) {
		return;
	}

	clearPopupTimer();
	clearPopupCloseTimer();
	isPopupClosing.value = true;

	popupCloseTimer.value = setTimeout(() => {
		isSuccess.value = false;
		isError.value = false;
		isPopupClosing.value = false;
		popupAutoCloseSeconds.value = POPUP_AUTO_CLOSE_SECONDS;
		popupCloseTimer.value = null;
	}, POPUP_CLOSE_ANIMATION_MS);
};

function clearPopupCloseTimer() {
	if (!popupCloseTimer.value) {
		return;
	}

	clearTimeout(popupCloseTimer.value);
	popupCloseTimer.value = null;
}

const resetPopupState = () => {
	clearPopupTimer();
	clearPopupCloseTimer();
	isSuccess.value = false;
	isError.value = false;
	isPopupClosing.value = false;
	popupAutoCloseSeconds.value = POPUP_AUTO_CLOSE_SECONDS;
};

function clearPopupTimer() {
	if (!popupTimer.value) {
		return;
	}

	clearInterval(popupTimer.value);
	popupTimer.value = null;
}

const startPopupTimer = () => {
	clearPopupTimer();
	popupAutoCloseSeconds.value = POPUP_AUTO_CLOSE_SECONDS;

	popupTimer.value = setInterval(() => {
		popupAutoCloseSeconds.value -= 1;

		if (popupAutoCloseSeconds.value <= 0) {
			closePopup();
		}
	}, 1000);
};

const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === "Escape" && isPopupOpen.value) {
		closePopup();
	}
};

const animate = () => {
	const tl = $gsap.timeline();

	socialRef.value?.forEach((item) => {
		const el = item instanceof HTMLElement ? item : item.$el;

		tl.from(el, {
			scrollTrigger: {
				trigger: el,
				start: "top 80%",
				end: "top 70%",
				toggleActions: "play none resume reverse",
				scrub: true,
			},
			autoAlpha: 0,
			x: -100,
		});
	});
};

watch(isPopupOpen, (isOpen) => {
	if (isOpen) {
		startPopupTimer();
		return;
	}

	clearPopupTimer();
});

onMounted(() => {
	nextTick(animate);
	window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
	resetPopupState();
	window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
	<TheSectionWrapper title="Contact me">
		<div ref="wrapperRef" :class="$style.ContactForm">
			<div :class="$style.socials">
				<NuxtLink
					v-for="item in props.data"
					:key="item.name"
					ref="socialRef"
					:class="$style.socialLink"
					:to="item.link"
					:aria-label="`Open ${item.name}`"
					rel="noopener noreferrer"
					target="_blank"
				>
					<span :class="$style.socialIcon" v-html="item.icon" />
					<span :class="$style.socialName">{{ item.name }}</span>
				</NuxtLink>
			</div>

			<form :class="$style.form" @submit.prevent="handleSubmit">
				<label :class="$style.field">
					<span id="contact-name-label">Name</span>
					<input
						v-model="form.name"
						type="text"
						name="name"
						autocomplete="name"
						required
						placeholder="Your name"
						aria-labelledby="contact-name-label"
						aria-describedby="contact-name-error"
					/>
				</label>

				<label :class="$style.field">
					<span id="contact-email-label">Email</span>
					<input
						v-model="form.email"
						type="email"
						name="email"
						autocomplete="email"
						required
						placeholder="your@email.com"
						aria-labelledby="contact-email-label"
						aria-describedby="contact-email-error"
						:aria-invalid="Boolean(!isEmailValid)"
					/>
				</label>

				<label :class="[$style.field, $style.messageField]">
					<span id="contact-message-label">Message</span>
					<textarea
						v-model="form.message"
						name="message"
						required
						rows="7"
						placeholder="Tell me about your task"
						aria-labelledby="contact-message-label"
						aria-describedby="contact-message-error"
					/>
				</label>

				<VButton
					:label="$t('button.send')"
					type="submit"
					:disabled="!isFormReady"
					:loading="isLoading"
					:class="$style.submit"
				/>
			</form>
		</div>
	</TheSectionWrapper>

	<Teleport to="body">
		<Transition name="fade">
			<div
				v-if="isPopupOpen"
				:class="$style.popupOverlay"
				role="presentation"
				@click.self="closePopup"
			>
				<section
					:class="[
						$style.popup,
						isError ? $style.popup_error : $style.popup_success,
						isPopupClosing && $style.popup_closing,
					]"
					role="dialog"
					aria-modal="true"
					aria-labelledby="contact-popup-title"
				>
					<p :class="$style.popupSup">
						{{
							$t(
								`contactForm.popup.${isError ? "errorSup" : "successSup"}`,
							)
						}}
					</p>
					<h2 id="contact-popup-title" :class="$style.popupTitle">
						{{
							$t(
								`contactForm.popup.${isError ? "errorTitle" : "successTitle"}`,
							)
						}}
					</h2>
					<p :class="$style.popupText">
						{{
							$t(
								`contactForm.popup.${isError ? "errorText" : "successText"}`,
							)
						}}
					</p>

					<div :class="$style.popupActions">
						<VButton
							:label="$t('contactForm.popup.button')"
							type="button"
							:class="$style.popupButton"
							@click="closePopup"
						/>
						<span :class="$style.popupTimer" aria-live="polite">
							{{
								$t("contactForm.popup.autoClose", {
									count: popupAutoCloseSeconds,
								})
							}}
						</span>
					</div>
				</section>
			</div>
		</Transition>
	</Teleport>
</template>

<style module lang="scss">
.ContactForm {
	display: grid;
	grid-template-columns: 1fr 2.5fr;
	gap: 4rem;
	align-items: start;
}

.socials {
	display: grid;
}

.socialLink {
	display: flex;
	align-items: center;
	gap: 1.6rem;
	min-height: 6.4rem;
	padding: 1.4rem 0.8rem;
	color: $gray5;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	transition: $default-transition;
	position: relative;
	overflow: hidden;

	&:before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		width: 100%;
		height: 100%;
		background: $gray5;
		transform: translateX(-100%);
		transition: $default-transition;
	}

	@include hover {
		color: $black;

		&:before {
			transform: translateX(0);
		}
	}
}

.socialIcon,
.socialName {
	position: relative;
	z-index: 1;
}

.socialIcon {
	width: 4.8rem;
	height: 4.8rem;
	display: flex;
	align-items: center;
	justify-content: center;
	color: $gray4;
	border-radius: 50%;
}

.socialName {
	font-size: 1.8rem;
}

.form {
	position: relative;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 2.4rem;
}

.field {
	display: grid;
	gap: 1rem;

	span {
		font-size: 1.2rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: $gray4;
	}

	input,
	textarea {
		width: 100%;
		padding: 1.6rem 0;
		color: $white;
		background: transparent;
		border-bottom: 1px solid rgba(255, 255, 255, 0.18);
		outline: none;
		transition: $default-transition;
		resize: none;

		&::placeholder {
			color: $gray2;
		}

		&:focus {
			border-color: $white;
		}
	}
}

.messageField {
	grid-column: 1 / -1;
}

@include media($tablet) {
	.ContactForm {
		grid-template-columns: 1fr;
	}
}

@include media($mobile) {
	.hero {
		min-height: 64vh;
		padding: 12rem 2rem 6rem;
	}

	.title {
		font-size: 4.6rem;
	}

	.subtitle {
		font-size: 1.6rem;
	}

	.form {
		grid-template-columns: 1fr;
	}
}

.popupOverlay {
	position: fixed;
	inset: 0;
	z-index: 100;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	background:
		linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 38%),
		rgba($black, 0.82);
	backdrop-filter: blur(10px);
}

.popup {
	position: relative;
	width: min(100%, 54rem);
	display: grid;
	gap: 1.8rem;
	padding: 4.8rem;
	color: $white;
	background: rgba($black, 0.92);
	border: 1px solid rgba($white, 0.16);
	box-shadow: 0 2.4rem 8rem rgba($black, 0.5);
	overflow: hidden;

	> * {
		position: relative;
		z-index: 1;
	}

	&:before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		width: 100%;
		height: 1px;
		background: $gray5;
		transition:
			height 0.55s ease,
			opacity 0.55s ease;
	}
}

.popup_success {
	&:before {
		background: $success;
	}
}

.popup_error {
	&:before {
		background: $error;
	}
}

.popup_closing {
	&:before {
		height: 100%;
		opacity: 0.2;
	}
}

.popupSup {
	padding-right: 4rem;
	font-size: 1.2rem;
	line-height: 1.5;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: $gray4;
}

.popupTitle {
	padding-right: 4rem;
	font-family: $ff-title;
	font-size: 3.6rem;
	line-height: 1.12;
	text-transform: uppercase;
}

.popupText {
	max-width: 42rem;
	font-size: 1.6rem;
	line-height: 1.7;
	color: $gray5;
}

.popupActions {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 1.6rem;
	margin-top: 1rem;
}

.popupButton {
	flex: 0 0 auto;
}

.popupTimer {
	font-size: 1.2rem;
	line-height: 1.5;
	color: $gray4;
}

@include media($mobile) {
	.popupOverlay {
		align-items: flex-end;
		padding: 1.2rem;
	}

	.popup {
		padding: 4rem 2rem 2.4rem;
	}

	.popupTitle {
		font-size: 2.8rem;
	}
}
</style>

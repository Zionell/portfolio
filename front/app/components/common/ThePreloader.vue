<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { $gsap } = nuxtApp;
const { finish } = usePreloader();

const COLUMNS = 6;
const MIN_DURATION = 1400;
const FALLBACK_DURATION = 7000;
const EASING = 0.15;

const WEIGHTS = {
	hydration: 35,
	fonts: 20,
	load: 45,
};

const isVisible = ref(true);
const state = reactive({ value: 0 });

const isReduced =
	import.meta.client &&
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const topRef = useTemplateRef<HTMLElement>("topRef");
const counterRef = useTemplateRef<HTMLElement>("counterRef");
const bottomRef = useTemplateRef<HTMLElement>("bottomRef");
const lineRef = useTemplateRef<HTMLElement>("lineRef");
const columnsRef = useTemplateRef<HTMLElement[]>("columnsRef");

const phases = reactive({
	hydration: 0,
	fonts: 0,
	load: 0,
});

const target = computed(
	() =>
		phases.hydration * WEIGHTS.hydration +
		phases.fonts * WEIGHTS.fonts +
		phases.load * WEIGHTS.load,
);

const progress = computed(() => Math.round(state.value));

const digits = computed(() =>
	String(progress.value)
		.padStart(3, "0")
		.split("")
		.map((digit) => Number(digit)),
);

const statusKey = computed(() => {
	if (progress.value < 35) return "init";
	if (progress.value < 70) return "assets";
	if (progress.value < 100) return "interface";

	return "ready";
});

const markOffset = computed(() => 1 - state.value / 100);

useHead({
	bodyAttrs: {
		class: computed(() => (isVisible.value ? "_preloading" : "")),
	},
	noscript: [
		{
			innerHTML:
				"<style>.js-preloader{display:none!important}body._preloading{overflow:visible!important}</style>",
		},
	],
});

const playOutro = () => {
	if (isReduced) {
		finish();
		isVisible.value = false;

		return;
	}

	const tl = $gsap.timeline({
		onComplete: () => {
			isVisible.value = false;
		},
	});

	tl.to([topRef.value, bottomRef.value], {
		y: -20,
		autoAlpha: 0,
		duration: 0.4,
		ease: "power2.in",
		stagger: 0.06,
	})
		.to(
			counterRef.value,
			{
				y: -60,
				autoAlpha: 0,
				duration: 0.5,
				ease: "power3.in",
			},
			"-=0.25",
		)
		.to(
			lineRef.value,
			{
				scaleY: 0,
				autoAlpha: 0,
				duration: 0.3,
				ease: "power2.in",
			},
			"<",
		)
		.to(
			columnsRef.value || [],
			{
				yPercent: -100,
				duration: 1,
				ease: "power4.inOut",
				stagger: 0.06,
			},
			"-=0.1",
		)
		.add(finish, "<+=0.2");
};

let isFinished = false;
let fallbackId = 0;
let startedAt = 0;
let reached = 0;

const onHydrated = () => {
	phases.hydration = 1;
};

const onLoad = () => {
	phases.load = 1;
};

const complete = () => {
	if (isFinished) return;

	isFinished = true;
	teardown();
	playOutro();
};

const forceComplete = () => {
	phases.hydration = 1;
	phases.fonts = 1;
	phases.load = 1;
};

const tick = () => {
	reached = Math.max(reached, target.value);

	const timeCap = ((performance.now() - startedAt) / MIN_DURATION) * 100;

	state.value += (Math.min(reached, timeCap) - state.value) * EASING;

	if (reached >= 100 && state.value > 99.4) {
		state.value = 100;
		complete();
	}
};

const teardown = () => {
	$gsap.ticker.remove(tick);
	window.removeEventListener("load", onLoad);
	window.clearTimeout(fallbackId);
};

onMounted(() => {
	startedAt = performance.now();

	if (!isReduced) {
		$gsap.from([topRef.value, counterRef.value, bottomRef.value], {
			y: 24,
			autoAlpha: 0,
			duration: 0.6,
			ease: "power3.out",
			stagger: 0.08,
		});
	}

	if (nuxtApp.isHydrating) {
		nuxtApp.hooks.hookOnce("app:suspense:resolve", onHydrated);
	} else {
		onHydrated();
	}

	document.fonts.ready.then(() => {
		phases.fonts = 1;
	});

	if (document.readyState === "complete") {
		onLoad();
	} else {
		window.addEventListener("load", onLoad, { once: true });
	}

	fallbackId = window.setTimeout(forceComplete, FALLBACK_DURATION);

	$gsap.ticker.add(tick);
});

onBeforeUnmount(teardown);
</script>

<template>
	<div
		v-if="isVisible"
		class="js-preloader"
		:class="$style.ThePreloader"
		role="status"
		aria-live="polite"
	>
		<div :class="$style.curtain" aria-hidden="true">
			<span
				v-for="column in COLUMNS"
				:key="column"
				ref="columnsRef"
				:class="$style.column"
			/>
		</div>

		<div :class="$style.grid" aria-hidden="true" />

		<div :class="$style.inner">
			<div ref="topRef" :class="$style.top">
				<span :class="$style.mark" aria-hidden="true">
					<svg viewBox="0 0 86 84" fill="none">
						<path
							pathLength="1"
							:style="{ strokeDashoffset: markOffset }"
							:class="$style.markPath"
							d="M2 18V61H22.375H32.5625M2 18V10.5H83.5V18M2 18H12.5M18 18H23.5M28.5 18H35.75H43H83.5M83.5 18V61H63.125H52.9375M33 29.5L24 39.5L33 49.5M49.75 23.75L42.75 39.5L35.75 55.25M52 29.5L61.5 39.5L52 49.5M11 73H27.125M75.5 73H59.375M52.9375 61H42.75H32.5625M52.9375 61L59.375 73M32.5625 61L27.125 73M27.125 73H43.25H59.375"
							stroke="currentColor"
							stroke-width="4"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>

				<span :class="$style.meta">askarov.dev</span>
			</div>

			<div :class="$style.bottom">
				<div ref="bottomRef" :class="$style.info">
					<span :class="$style.status">
						<i :class="$style.dot" />
						{{ $t(`preloader.${statusKey}`) }}
					</span>
					<span :class="$style.hint">{{ $t("preloader.hint") }}</span>
				</div>

				<div ref="counterRef" :class="$style.counter">
					<span :class="$style.digits">
						<span
							v-for="(digit, index) in digits"
							:key="index"
							:class="$style.digit"
						>
							<span
								:class="$style.strip"
								:style="{
									transform: `translateY(${digit * -10}%)`,
								}"
							>
								<span
									v-for="n in 10"
									:key="n"
									:class="$style.digitItem"
								>
									{{ n - 1 }}
								</span>
							</span>
						</span>
					</span>

					<span :class="$style.percent">%</span>
				</div>
			</div>
		</div>

		<div ref="lineRef" :class="$style.line" aria-hidden="true">
			<span
				:class="$style.lineFill"
				:style="{ transform: `scaleX(${state.value / 100})` }"
			/>
		</div>
	</div>
</template>

<style lang="scss" module>
.ThePreloader {
	position: fixed;
	inset: 0;
	z-index: 1000;
	color: $white;
	overflow: hidden;
}

.curtain {
	position: absolute;
	inset: 0;
	z-index: 0;
	display: flex;
}

.column {
	position: relative;
	flex: 1;
	background: $black;

	// стык колонок на дробных пикселях даёт светлые полоски — перекрываем
	& + & {
		margin-left: -1px;
	}
}

.grid {
	position: absolute;
	inset: 0;
	z-index: 1;
	opacity: 0.5;
	pointer-events: none;
	background:
		radial-gradient(
			circle at 50% 55%,
			rgba($gray5, 0.16) 0%,
			rgba($black, 0) 60%
		),
		repeating-linear-gradient(
			90deg,
			rgba($white, 0.035) 0 1px,
			rgba($white, 0) 1px 12rem
		);
}

.inner {
	position: relative;
	z-index: 2;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	padding: 4rem 6rem 6rem;

	@include media($mobile) {
		padding: 4rem 2rem 5rem;
	}
}

.top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 2rem;
}

.mark {
	display: block;
	width: 5.6rem;
	color: $white;

	svg {
		display: block;
		width: 100%;
		height: auto;
	}

	@include media($mobile) {
		width: 4.4rem;
	}
}

.markPath {
	stroke-dasharray: 1;
	transition: stroke-dashoffset 0.4s linear;
}

.meta,
.hint {
	font-size: 1.2rem;
	letter-spacing: 0.24em;
	text-transform: uppercase;
	color: $gray4;
}

.bottom {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 3rem;

	@include media($mobile) {
		flex-direction: column-reverse;
		align-items: flex-start;
		gap: 2.4rem;
	}
}

.info {
	display: flex;
	flex-direction: column;
	gap: 1.2rem;
	padding-bottom: 1.6rem;

	@include media($mobile) {
		padding-bottom: 0;
	}
}

.status {
	display: flex;
	align-items: center;
	gap: 1rem;
	font-size: 1.4rem;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: $white;
}

.dot {
	width: 0.6rem;
	height: 0.6rem;
	flex-shrink: 0;
	background: $success;
	animation: blink 1.1s steps(1, end) infinite;
}

.counter {
	display: flex;
	align-items: flex-start;
	gap: 1.2rem;
	font-family: $ff-title;
	line-height: 0.78;
	color: $white;
}

.digits {
	display: flex;
	font-size: 16rem;

	@include media($tablet) {
		font-size: 12rem;
	}

	@include media($mobile) {
		font-size: 8.4rem;
	}
}

.digit {
	display: block;
	height: 0.78em;
	overflow: hidden;
}

.strip {
	display: flex;
	flex-direction: column;
	transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.digitItem {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 0.78em;
	width: 0.64em;
}

.percent {
	font-size: 3.2rem;
	color: $gray4;

	@include media($mobile) {
		font-size: 2rem;
	}
}

.line {
	position: absolute;
	bottom: 0;
	left: 0;
	z-index: 2;
	width: 100%;
	height: 0.2rem;
	background: rgba($white, 0.12);
	transform-origin: bottom;
}

.lineFill {
	display: block;
	height: 100%;
	width: 100%;
	background: $white;
	transform-origin: left;
	transform: scaleX(0);
	transition: transform 0.35s linear;
}

@media (prefers-reduced-motion: reduce) {
	.markPath,
	.strip,
	.lineFill {
		transition: none;
	}

	.dot {
		animation: none;
	}
}

@keyframes blink {
	0%,
	60% {
		opacity: 1;
	}
	61%,
	100% {
		opacity: 0.15;
	}
}
</style>

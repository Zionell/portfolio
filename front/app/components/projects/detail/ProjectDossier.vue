<script setup lang="ts">
/**
 * Вариант 1 — «Досье».
 * Липкая колонка со сводкой слева, содержательный поток справа.
 * Блоки идут строками с крупным номером и волосяной линией, без карточек —
 * страница читается как техническая спецификация.
 */
import type { IProjectDetail } from "#shared/types/project.types";

const props = defineProps<{
	project: IProjectDetail;
}>();

const project = computed(() => props.project);
const { links, counter } = useProjectDetail(project);
</script>

<template>
	<main :class="[$style.ProjectDossier, 'container']">
		<header :class="$style.topbar">
			<NuxtLink :class="$style.back" to="/projects">
				<span aria-hidden="true">←</span>
				{{ $t("project.back") }}
			</NuxtLink>
			<span :class="$style.rule" />
		</header>

		<div :class="$style.grid">
			<aside :class="$style.rail">
				<div v-if="links.length" :class="$style.railBlock">
					<p :class="$style.railTitle">
						{{ $t("project.resources") }}
					</p>
					<a
						v-for="link in links"
						:key="link.id"
						:class="$style.link"
						:href="link.url"
						target="_blank"
						rel="noopener"
					>
						{{ link.label }}
						<span aria-hidden="true">↗</span>
					</a>
				</div>


				<div v-if="project.stack.length" :class="$style.railBlock">
					<p :class="$style.railTitle">{{ $t("project.stack") }}</p>
					<p :class="$style.stack">
						{{ project.stack.join(" · ") }}
					</p>
				</div>
			</aside>

			<div :class="$style.body">
				<p v-if="project.eyebrow" :class="$style.eyebrow">
					{{ project.eyebrow }}
				</p>

				<h1 :class="$style.title">{{ project.name }}</h1>

				<p v-if="project.description" :class="$style.lead">
					{{ project.description }}
				</p>

				<ul v-if="project.blocks.length" :class="$style.blocks">
					<li
						v-for="(block, ind) in project.blocks"
						:key="block.id"
						:class="$style.block"
					>
						<span :class="$style.counter">{{ counter(ind) }}</span>
						<div :class="$style.blockBody">
							<h2 :class="$style.blockTitle">
								{{ block.title }}
							</h2>
							<p :class="$style.blockText">{{ block.text }}</p>
						</div>
					</li>
				</ul>

				<ul v-if="project.images.length" :class="$style.gallery">
					<li
						v-for="shot in project.images"
						:key="shot.id"
						:class="[$style.shot, { [$style._wide]: shot.isWide }]"
					>
						<div :class="$style.shotFrame">
							<NuxtImg
								:class="$style.shotImage"
								:src="shot.image"
								:alt="shot.caption || project.name"
								loading="lazy"
								placeholder
							/>
						</div>
						<p v-if="shot.caption" :class="$style.caption">
							{{ shot.caption }}
						</p>
					</li>
				</ul>
			</div>
		</div>
	</main>
</template>

<style lang="scss" module>
.ProjectDossier {
	display: flex;
	flex-direction: column;
	gap: 4.8rem;
	padding: 14rem 6rem 10rem;

	@include media($mobile) {
		padding: 8rem 2rem 4rem;
		gap: 2.4rem;
	}
}

.topbar {
	display: flex;
	align-items: center;
	gap: 2.4rem;
}

.back {
	display: inline-flex;
	align-items: center;
	gap: 0.8rem;
	font-size: 1.2rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	text-decoration: none;
	white-space: nowrap;

	@include link-sweep($gray4, $accent);
}

.rule {
	height: 1px;
	flex: 1;
	background: rgba($white, 0.12);
}

.grid {
	display: grid;
	grid-template-columns: minmax(0, 26rem) minmax(0, 1fr);
	gap: 6rem;
	align-items: start;

	@include media($tablet) {
		grid-template-columns: 1fr;
		gap: 3.2rem;
	}
}

.rail {
	position: sticky;
	top: 12rem;
	display: flex;
	flex-direction: column;
	gap: 3.2rem;
	padding-right: 2.4rem;
	border-right: 1px solid rgba($white, 0.08);

	@include media($tablet) {
		position: static;
		padding: 0 0 2.4rem;
		border-right: none;
		border-bottom: 1px solid rgba($white, 0.08);
	}
}

.railBlock {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1.2rem;
}

.railTitle {
	font-size: 1.1rem;
	letter-spacing: 0.24em;
	text-transform: uppercase;
	color: $gray3;
}

.eyebrow {
	font-size: 1.2rem;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: $accent-light;
}

.link {
	display: inline-flex;
	align-items: center;
	gap: 0.6rem;
	font-size: 1.4rem;
	text-decoration: none;

	@include link-sweep($gray6, $accent);
}


.stack {
	font-size: 1.3rem;
	line-height: 1.7;
	color: $gray5;
}

.body {
	display: flex;
	flex-direction: column;
	gap: 3.2rem;
	min-width: 0;
}

// надзаголовок и заголовок — одна связка, между ними воздуха меньше,
// чем между остальными блоками колонки
.eyebrow + .title {
	margin-top: -2rem;
}

.title {
	font-family: $ff-title;
	font-size: 6.4rem;
	line-height: 1.05;
	text-transform: uppercase;
	color: $white;

	@include media($tablet) {
		font-size: 4.8rem;
	}

	@include media($mobile) {
		font-size: 3.2rem;
	}
}

.lead {
	font-size: 1.9rem;
	line-height: 1.7;
	color: $gray5;
	max-width: 72ch;

	@include media($mobile) {
		font-size: 1.5rem;
	}
}

.blocks {
	display: flex;
	flex-direction: column;
	border-top: 1px solid rgba($white, 0.1);
}

.block {
	display: grid;
	grid-template-columns: 6rem minmax(0, 1fr);
	gap: 2.4rem;
	padding: 2.8rem 0;
	border-bottom: 1px solid rgba($white, 0.1);

	@include media($mobile) {
		grid-template-columns: 4rem minmax(0, 1fr);
		gap: 1.6rem;
		padding: 2rem 0;
	}
}

.counter {
	font-family: $ff-title;
	font-size: 2rem;
	line-height: 1.2;
	color: $accent;
}

.blockBody {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	min-width: 0;
}

.blockTitle {
	font-family: $ff-title;
	font-size: 2.2rem;
	color: $white;
}

.blockText {
	font-size: 1.5rem;
	line-height: 1.7;
	color: $gray5;
	max-width: 68ch;
}

.gallery {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 2.4rem;
	align-items: start;

	@include media($mobile) {
		grid-template-columns: 1fr;
	}
}

.shot {
	display: flex;
	flex-direction: column;
	gap: 1.2rem;
	min-width: 0;
}

.shot._wide {
	grid-column: 1 / -1;
}

// скриншоты почти всегда светлые — рамка отделяет их от чёрного фона
.shotFrame {
	overflow: hidden;
	border: 1px solid rgba($white, 0.08);
	background: rgba($white, 0.04);
}

.shotImage {
	display: block;
	width: 100%;
	height: auto;
}

.caption {
	font-size: 1.2rem;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: $gray4;
}
</style>

<script setup lang="ts">
import TheTag from "~/components/ui/tags/TheTag.vue";

const props = defineProps<{
	project: IProjectCard;
}>();

const { t } = useI18n();

const component = computed(() => {
	if (props.project.hasDetail) {
		return {
			tag: resolveComponent("NuxtLink"),
			attrs: {
				to: `/projects/${props.project.slug}`,
			},
		};
	}

	if (props.project.link) {
		return {
			tag: "a",
			attrs: {
				href: props.project.link,
				target: "_blank",
				rel: "noopener",
			},
		};
	}

	return {
		tag: "div",
		attrs: {},
	};
});

const tag = computed((): ITag | null => {
	if (props.project.isArchived) {
		return {
			label: t("project.archived"),
			color: Colors.WARNING,
		};
	}

	if (props.project.isDeveloping) {
		return {
			label: t("project.developing"),
			color: Colors.ERROR,
		};
	}

	return null;
});

const tech = computed((): string => {
	return props.project?.stack?.map((s) => s.label).join(" · ");
});

const linkLabel = computed((): string => {
	if (props.project.hasDetail) {
		return t("project.details");
	}

	return props.project?.link
		? props.project?.link.replace(/^https?:\/\//, "").replace(/\/$/, "")
		: "";
});
</script>

<template>
	<component
		:is="component.tag"
		v-bind="component.attrs"
		:class="$style.card"
	>
		<NuxtImg
			v-if="project.image"
			:class="$style.coverImg"
			:src="project.image"
			:alt="project.name"
			loading="lazy"
			placeholder
		/>

		<div :class="$style.body">
			<div :class="$style.head">
				<h3 :class="$style.name">{{ project.name }}</h3>

				<TheTag v-if="tag" :tag="tag" />
			</div>

			<p v-if="tech" :class="$style.tech">
				{{ tech }}
			</p>

			<p v-if="linkLabel" :class="$style.link">
				<span :class="$style.arrow">
					{{ project.hasDetail ? "→" : "↗" }}
				</span>
				{{ linkLabel }}
			</p>
		</div>
	</component>
</template>

<style module lang="scss">
.card {
	display: flex;
	flex-direction: column;
	border-radius: 0.8rem;
	border: 1px solid rgba($white, 0.08);
	background: rgba($white, 0.02);
	padding: 0;
	overflow: hidden;
	text-decoration: none;
	color: $gray4;
	transition: $default-transition;
	user-select: none;
	transform-origin: bottom;

	@include hover {
		border-color: rgba($accent, 0.55);
		box-shadow: 0 0 3.2rem rgba($accent, 0.12);
		transform: translateY(-4px) scaleY(1.05) !important;
	}
}

.coverImg {
	width: 100%;
	height: 24rem;
	object-fit: cover;
	background: #3f424d;
}

.body {
	padding: 2rem 2.2rem 2.2rem;
	display: flex;
	flex-direction: column;
	gap: 1.2rem;
	flex: 1;
}

.head {
	display: flex;
	align-items: center;
	gap: 1rem;
	justify-content: space-between;
}

.name {
	font-family: $ff-title;
	font-size: 1.8rem;
	color: $gray6;
}

.tech {
	font-size: 1.2rem;
	color: $gray4;
	font-feature-settings: "tnum" 1;
}

.link {
	font-size: 1.2rem;
	color: $gray4;
	display: flex;
	align-items: center;
	gap: 0.6rem;
	margin-top: auto;
}

.arrow {
	color: $accent;
	text-shadow: 0 0 1.2rem $accent-glow;
}
</style>

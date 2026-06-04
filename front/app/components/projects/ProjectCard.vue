<script setup lang="ts">
import TheTags from "~/components/ui/tags/TheTags.vue";
import type { IHomeProject } from "#shared/types/home.types";
import { Colors, type ITag } from "#shared/types/common.types";

const props = defineProps<{
	project: IHomeProject;
	reverse?: boolean;
}>();

const { locale } = useI18n();
const $style = useCssModule();

const classes = computed(() => {
	return [
		$style.ProjectCard,
		{
			[$style._hasLink]: props.project.link,
			[$style._reverse]: props.reverse,
		},
	];
});

const tags = computed((): ITag[] => {
	const tagsArr: ITag[] = [];

	if (props.project.isArchived) {
		tagsArr.push({
			label: "Archived",
			color: Colors.WARNING,
		});
	}

	if (props.project.isDeveloping) {
		tagsArr.push({
			label: "Developing",
			color: Colors.ERROR,
		});
	}

	return tagsArr;
});

const description = computed((): string => {
	return props.project[`description_${locale.value}`] ?? "";
});
</script>

<template>
	<div :class="classes">
		<img
			v-if="props.project?.image"
			:class="$style.img"
			:src="props.project.image"
			alt="image of ceramic piece"
			data-webgl-media
		/>

		<div :class="$style.body">
			<div :class="$style.header">
				<h3 :class="$style.title">
					{{ props.project.name }}
				</h3>

				<TheTags v-if="tags?.length" :tags="tags" column />
			</div>

			<div :class="$style.content">
				<ul :class="$style.stackList">
					<li
						v-for="stack in props.project.stack"
						:class="$style.stack"
					>
						{{ stack.label }}
					</li>
				</ul>

				<div v-if="description" :class="$style.desc">
					{{ description }}
				</div>
			</div>

			<NuxtLink
				v-if="props.project.link"
				:to="props.project.link"
				:class="$style.link"
				target="_blank"
			>
				<svg
					fill="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M22,12v9a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V3A1,1,0,0,1,3,2h9a1,1,0,0,1,0,2H4V20H20V12a1,1,0,0,1,2,0Zm-.618-9.923A.991.991,0,0,0,21,2H16a1,1,0,0,0,0,2h2.586l-7.293,7.293a1,1,0,1,0,1.414,1.414L20,5.414V8a1,1,0,0,0,2,0V3a1.01,1.01,0,0,0-.077-.382A1,1,0,0,0,21.382,2.077Z"
					/>
				</svg>
			</NuxtLink>
		</div>
	</div>
</template>

<style module lang="scss">
.ProjectCard {
	position: relative;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 6rem;
	height: 60vh;

	@include media($tablet) {
		height: 50vh;
	}

	@include media($mobile) {
		grid-template-columns: 1fr;
		gap: 3.2rem;
		height: auto;
	}

	&._hasLink {
		.body {
			@include hover {
				.link {
					transform: translateX(0);
					opacity: 1;
				}
			}
		}
	}

	&._reverse {
		img {
			order: 2;
		}

		.body {
			order: 1;
		}

		.link {
			right: auto;
			left: 0;
			transform: translateX(-100%);
			background: linear-gradient(
				to right,
				rgba($gray1, 0.3) 0%,
				transparent 70%
			);

			@include media($tablet) {
				position: relative;
				transform: translateX(0);
				opacity: 1;
				height: fit-content;
				align-self: end;
				justify-self: end;
				background: none;
			}
		}

		@include media($mobile) {
			img {
				order: 1;
			}

			.body {
				order: 2;
			}
		}
	}
}

.img {
	position: relative;
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: $default-transition;
	z-index: 0;

	@include media($mobile) {
		height: 30vh;
	}
}

.content {
	margin-top: auto;
}

.body {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	overflow: hidden;
	gap: 3.2rem;

	@include media($tablet) {
		display: grid;
		grid-template-columns: 1fr 0.3fr;
	}
}

.header {
	display: flex;
	justify-content: space-between;

	@include media($tablet) {
		grid-column: 1 / -1;
	}
}

.title {
	font-size: 2.4rem;
	color: $white;
}

.desc {
	font-size: 1.6rem;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: $gray5;
}

.stackList {
	padding: 1.2rem 0;
	display: flex;
	flex-wrap: wrap;
	gap: 0.8rem;
}

.stack {
	font-size: 1.3rem;
	color: $gray4;
	display: flex;
	align-items: center;
	gap: 0.8rem;

	&:not(:last-child):after {
		content: "•";
	}
}

.link {
	position: absolute;
	top: 0;
	right: 0;
	opacity: 0;
	transform: translateX(100%);
	transition: $default-transition;
	color: $white;
	width: 50%;
	height: 100%;
	background: linear-gradient(to left, rgba($gray1, 0.4) 0%, transparent 50%);
	display: flex;
	align-items: center;
	justify-content: center;
	backdrop-filter: blur(3px);

	svg {
		width: 2.4rem;
		height: 2.4rem;
	}

	@include media($tablet) {
		position: relative;
		transform: translateX(0);
		opacity: 1;
		height: fit-content;
		align-self: end;
		justify-self: end;
		background: none;
	}
}
</style>

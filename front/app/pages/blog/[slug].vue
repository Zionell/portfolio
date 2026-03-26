<script setup lang="ts">
import { blogPosts } from "~/assets/data/blog";

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));

const post = computed(() => blogPosts.find((item) => item.slug === slug.value));

const formatDate = (value: string): string => {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
};

watch(
	post,
	(value) => {
		if (!value) {
			throw createError({
				statusCode: 404,
				statusMessage: "Post not found",
			});
		}
	},
	{ immediate: true },
);
</script>

<template>
	<main :class="$style.page">
		<section v-if="post" :class="$style.section">
			<header :class="$style.header">
				<NuxtLink :class="$style.back" to="/blog"
					>Back to Blog</NuxtLink
				>
				<span :class="$style.rule" />
			</header>

			<div :class="$style.postHeader">
				<NuxtImg
					:class="$style.cover"
					:src="post.cover || '/images/projects/rendered.jpg'"
					:alt="post.title"
					placeholder
				/>
				<div :class="$style.postMeta">
					<h1 :class="$style.title">{{ post.title }}</h1>
					<p :class="$style.excerpt">{{ post.excerpt }}</p>
					<div :class="$style.meta">
						<div :class="$style.tags">
							<span
								v-for="tag in post.tags"
								:key="tag"
								:class="$style.tag"
							>
								{{ tag }}
							</span>
						</div>
						<span :class="$style.dot" />
						<span :class="$style.metaText">{{
							formatDate(post.date)
						}}</span>
						<span :class="$style.dot" />
						<span :class="$style.metaText"
							>{{ post.readTime }} min</span
						>
					</div>
				</div>
			</div>

			<div :class="$style.divider" />

			<div :class="$style.content">
				<p>
					This is a placeholder body for the post. When you connect
					the admin panel or CMS, replace this with real content.
				</p>
				<p>
					Use this space for the main narrative, decisions, and
					outcomes. You can also add images, quotes, and code snippets
					as needed.
				</p>
				<p>
					Start with a short introduction that frames the goal, then
					explain the constraints and your key decisions. Highlight
					the tradeoffs you accepted and why they were the right call
					for the user.
				</p>
				<p>
					Share any experiments or iterations you ran. Describe what
					you learned, what you discarded, and what finally shipped.
					This helps readers understand the thinking behind the final
					result.
				</p>
				<p>
					Finish with outcomes: performance, conversion, usability
					feedback, or client response. Even small wins matter, so
					make them visible.
				</p>
				<NuxtImg
					:class="$style.inlineImage"
					src="/images/projects/nomad.jpg"
					alt="Project highlight"
					placeholder
				/>
				<p>
					After the first release, we measure how the interface
					behaves in the wild and iterate on the most sensitive parts.
					Motion curves, typography rhythm, and visual balance are
					tuned based on real usage rather than aesthetic preference
					alone.
				</p>
				<p>
					Structure each section around a clear idea: context,
					decision, implementation, and result. This makes the story
					easy to scan and gives stakeholders confidence in the
					reasoning behind the solution.
				</p>
				<NuxtImg
					:class="$style.inlineImage"
					src="/images/projects/mogo.jpg"
					alt="Interface example"
					placeholder
				/>
				<p>
					If you want deeper technical details, add a focused
					appendix: performance notes, API decisions, tooling, or
					testing strategy. It keeps the main narrative readable while
					still serving engineers who want to dig in.
				</p>
			</div>
		</section>
	</main>
</template>

<style lang="scss" module>
.page {
	background: #000;
	color: $white;
}

.section {
	display: flex;
	flex-direction: column;
	gap: 3.2rem;
	padding: 8rem 6rem 10rem;

	//@media #{$mobile} {
	//	padding: 6rem 2.4rem 8rem;
	//}
}

.header {
	display: flex;
	align-items: center;
	gap: 2.4rem;
}

.back {
	font-size: 1.1rem;
	letter-spacing: 0.3em;
	text-transform: uppercase;
	color: $gray4;
	text-decoration: none;
	transition: $default-transition;

	@include hover {
		color: $white;
	}
}

.rule {
	height: 1px;
	flex: 1;
	background: rgba(255, 255, 255, 0.12);
}

.postMeta {
	display: grid;
	gap: 1.6rem;
	max-width: 72rem;
}

.postHeader {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2.4rem;
	align-items: start;
	max-width: 100%;
	margin: 0;
}

.meta {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.8rem;
	font-size: 1.1rem;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: $gray4;
}

.tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem;
}

.tag {
	border: 1px solid $gray3;
	border-radius: 999px;
	padding: 0.3rem 0.8rem;
	color: $gray5;
}

.dot {
	width: 0.4rem;
	height: 0.4rem;
	border-radius: 999px;
	background: $gray4;
}

.metaText {
	color: $gray4;
}

.title {
	font-family: $ff-title;
	font-size: 4.6rem;
	line-height: 1.1;
	text-transform: uppercase;

	//@media #{$mobile} {
	//	font-size: 3.2rem;
	//}
}

.excerpt {
	font-size: 1.6rem;
	line-height: 1.7;
	color: $gray5;
}

.cover {
	width: 100%;
	height: 40rem;
	object-fit: cover;
	border-radius: 1.6rem;
}

.divider {
	height: 1px;
	width: 100%;
	background: rgba(255, 255, 255, 0.12);
	margin: 1.6rem 0;
}

.inlineImage {
	width: 100%;
	height: 32rem;
	object-fit: cover;
	border-radius: 1.6rem;
}

.content {
	display: grid;
	gap: 1.6rem;
	max-width: 72rem;
	font-size: 1.6rem;
	line-height: 1.8;
	color: $gray5;
	margin: 0 auto;
}
</style>

<script
	setup
	lang="ts"
>
import {useWorksStore} from "~/store/works";

const {$state} = useWorksStore()
</script>

<template>
	<section id="works" :class="[$style.HomeWorks, 'section']">
		<h2 :class="[$style.title, 'title']">Projects</h2>
		<HomeWorksCard
			v-for="(card, ind) in $state.works"
			:key="ind"
			:card="card"
			:class="$style.card"
		/>
	</section>
</template>

<style
	lang="scss"
	module
>
	.HomeWorks {
		display: flex;
		flex-wrap: wrap;
		gap: 3.2rem;
		align-content: flex-start;
		justify-content: space-between;

		@include respond-to(mobile) {
			justify-content: center;
		}
	}

	.title {
		flex: 1 1 100%;
		padding-bottom: 5.6rem;

		@include respond-to(mobile) {
			padding-bottom: 3.2rem;
		}
	}

	.card {
		flex: 1 1 50rem;
	}
</style>

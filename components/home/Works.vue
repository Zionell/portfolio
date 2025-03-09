<script setup lang="ts">
const { $state } = useWorksStore();
</script>

<template>
	<section id="works" :class="[$style.HomeWorks, 'section']">
		<h2 :class="[$style.title, 'title']">Projects</h2>

		<div :class="$style.list">
			<WorksCard
				v-for="(card, ind) in $state.works"
				:key="ind"
				:card="card"
				:class="$style.card"
			/>
		</div>
	</section>
</template>

<style lang="scss" module>
.HomeWorks {
	display: flex;
	flex-direction: column;
	gap: 3.2rem;
}

.title {
	padding-bottom: 5.6rem;

	@include respond-to(mobile) {
		padding-bottom: 3.2rem;
	}
}

.list {
	display: flex;
	flex-wrap: wrap;
	gap: 3.2rem;

	@include respond-to(tablet) {
		gap: 2.4rem;
	}
}

.card {
	flex: 1 1 40%;

	@include respond-to(tablet) {
		flex: 1 1 100%;
	}
}
</style>

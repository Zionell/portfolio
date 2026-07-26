<script setup lang="ts">
const props = defineProps<{
	isSaving: boolean;
}>();

const emit = defineEmits<{
	save: [];
}>();
</script>

<template>
	<footer :class="$style.AdminSectionFooter">
		<slot />

		<PrimeButton
			:loading="props.isSaving"
			label="Save"
			@click="emit('save')"
		/>
	</footer>
</template>

<style module lang="scss">
.AdminSectionFooter {
	display: flex;
	align-items: center;
	gap: 2rem;
}

.helper {
	color: $gray4;
	font-size: 1.1rem;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.error {
	color: $error;
	font-size: 1.1rem;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}
</style>

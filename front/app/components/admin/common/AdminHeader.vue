<script setup lang="ts">
import type { ITab } from "#shared/types/admin.types";

const props = withDefaults(
	defineProps<{
		tabs?: ITab[];
		activeTab?: string;
		title?: string;
		description?: string;
	}>(),
	{
		title: "Home Page",
		description: "",
		tabs: () => [],
		activeTab: "",
	},
);

const emit = defineEmits<{
	"change-tab": [tab: string];
}>();
</script>

<template>
	<header :class="$style.AdminHeader">
		<h1 v-if="props.title" :class="$style.title">{{ props.title }}</h1>
		<p v-if="props.description" :class="$style.description">
			{{ props.description }}
		</p>

		<div :class="$style.bottom">
			<div v-if="props.tabs?.length" :class="$style.tabs">
				<PrimeButton
					v-for="tab in props.tabs"
					:key="tab.id"
					:disabled="props.activeTab === tab.id"
					:label="tab.label"
					@click="emit('change-tab', tab.id)"
				/>
			</div>

			<slot />
		</div>
	</header>
</template>

<style module lang="scss">
.AdminHeader {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	padding-bottom: 1.6rem;
	position: sticky;
	top: 0;
	z-index: 3;
	background: rgba(10, 10, 10, 0.85);
	backdrop-filter: blur(12px);
}

.top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.6rem;
}

.title {
	font-size: 2.4rem;
	letter-spacing: 0.16em;
	text-transform: uppercase;
}

.description {
	font-size: 1.4rem;
	color: $gray5;
}

.bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.tabs {
	display: flex;
	gap: 0.4rem;
}
</style>

<script setup lang="ts">
import { api } from "~/assets/data/api";
import type {
	IAnalyticsOverview,
	IPostGenerationError,
} from "#shared/types/analytics.types";

definePageMeta({
	layout: "admin",
});

// Цвета серий подобраны под тёмный фон админки и проверены на различимость
// при дальтонизме; текст графика — нейтральный, не цвета серий
const COLORS = {
	visits: "#3987e5",
	postViews: "#d95926",
	text: "#c3c2b7",
	muted: "#808285",
	grid: "rgba(255, 255, 255, 0.06)",
};

const periods = [
	{ label: "7 days", value: 7 },
	{ label: "30 days", value: 30 },
	{ label: "90 days", value: 90 },
];

const days = ref(30);

const { data: overview } = await useFetch<IAnalyticsOverview>(
	api.admin.analytics.overview,
	{ query: { days } },
);

const { data: errors } = await useFetch<IPostGenerationError[]>(
	api.admin.analytics.errors,
);

const dateTimeFormat = new Intl.DateTimeFormat("ru-RU", {
	dateStyle: "short",
	timeStyle: "short",
	timeZone: "Europe/Moscow",
});

const formatDateTime = (value: string) => dateTimeFormat.format(new Date(value));

// YYYY-MM-DD → DD.MM
const formatDay = (value: string) => value.slice(8, 10) + "." + value.slice(5, 7);

const tiles = computed(() => {
	const summary = overview.value?.summary;

	if (!summary) return [];

	return [
		{ label: "Visits", value: summary.visits, hint: "" },
		{ label: "Article views", value: summary.postViews, hint: "" },
		{
			label: "Bot visits",
			value: summary.bots,
			hint: "каждая загрузка страницы",
		},
		{
			label: "Generation errors",
			value: summary.errors,
			hint: "",
			isAlert: summary.errors > 0,
		},
	];
});

const chartData = computed(() => {
	const daily = overview.value?.daily || [];

	const line = (label: string, color: string, values: number[]) => ({
		label,
		data: values,
		borderColor: color,
		backgroundColor: color,
		borderWidth: 2,
		// на коротком периоде точки видны, иначе совпадающие значения
		// двух линий сливаются в одну
		pointRadius: daily.length <= 30 ? 3 : 0,
		pointHoverRadius: 4,
		pointHoverBorderWidth: 2,
		pointHoverBorderColor: "#0a0a0a",
	});

	return {
		labels: daily.map((day) => formatDay(day.date)),
		datasets: [
			line("Visits", COLORS.visits, daily.map((day) => day.visits)),
			line(
				"Article views",
				COLORS.postViews,
				daily.map((day) => day.postViews),
			),
		],
	};
});

const chartFont = { family: "'RobotoMono-Regular', monospace", size: 11 };

const chartOptions = {
	maintainAspectRatio: false,
	interaction: { mode: "index", intersect: false },
	plugins: {
		legend: {
			position: "top",
			align: "start",
			labels: {
				color: COLORS.text,
				boxWidth: 12,
				boxHeight: 2,
				font: chartFont,
			},
		},
		tooltip: {
			backgroundColor: "#1a1a19",
			titleColor: "#fff",
			bodyColor: COLORS.text,
			borderColor: "rgba(255, 255, 255, 0.12)",
			borderWidth: 1,
			padding: 10,
			boxWidth: 8,
			boxHeight: 8,
		},
	},
	scales: {
		x: {
			grid: { display: false },
			border: { color: COLORS.grid },
			ticks: {
				color: COLORS.muted,
				font: chartFont,
				maxRotation: 0,
				autoSkipPadding: 16,
			},
		},
		y: {
			beginAtZero: true,
			grid: { color: COLORS.grid },
			border: { display: false },
			ticks: { color: COLORS.muted, font: chartFont, precision: 0 },
		},
	},
};

</script>

<template>
	<section :class="$style.AdminSection">
		<AdminHeader title="Analytics">
			<PrimeSelectButton
				v-model="days"
				:options="periods"
				option-label="label"
				option-value="value"
				:allow-empty="false"
			/>
		</AdminHeader>

		<div :class="$style.tiles">
			<div
				v-for="tile in tiles"
				:key="tile.label"
				:class="[$style.tile, { [$style._alert]: tile.isAlert }]"
			>
				<p :class="$style.tileLabel">{{ tile.label }}</p>
				<p :class="$style.tileValue">{{ tile.value }}</p>
				<p v-if="tile.hint" :class="$style.tileHint">{{ tile.hint }}</p>
			</div>
		</div>

		<div :class="$style.panel">
			<h2 :class="$style.panelTitle">По дням</h2>
			<div :class="$style.chart">
				<PrimeChart
					type="line"
					:data="chartData"
					:options="chartOptions"
					:class="$style.chartCanvas"
				/>
			</div>
		</div>

		<div :class="$style.panel">
			<h2 :class="$style.panelTitle">Топ статей за период</h2>
			<PrimeDataTable
				v-if="overview?.topPosts?.length"
				:value="overview.topPosts"
				size="small"
			>
				<PrimeColumn header="Article">
					<template #body="{ data }">
						<NuxtLink
							:to="`/blog/${data.slug}`"
							target="_blank"
							:class="$style.link"
						>
							{{ data.title }}
						</NuxtLink>
					</template>
				</PrimeColumn>
				<PrimeColumn field="views" header="Views" :class="$style.num" />
			</PrimeDataTable>
			<p v-else :class="$style.empty">Нет просмотров за период</p>
		</div>

		<div :class="$style.panel">
			<h2 :class="$style.panelTitle">Ошибки генерации автопостов</h2>
			<PrimeDataTable v-if="errors?.length" :value="errors" size="small">
				<PrimeColumn header="Time">
					<template #body="{ data }">
						<span :class="$style.nowrap">
							{{ formatDateTime(data.createdAt) }}
						</span>
					</template>
				</PrimeColumn>
				<PrimeColumn header="Source">
					<template #body="{ data }">
						<PrimeTag :value="data.source" severity="secondary" />
					</template>
				</PrimeColumn>
				<PrimeColumn header="Error">
					<template #body="{ data }">
						<pre :class="$style.error">{{ data.message }}</pre>
					</template>
				</PrimeColumn>
			</PrimeDataTable>
			<p v-else :class="$style.empty">Ошибок не было</p>
		</div>
	</section>
</template>

<style lang="scss" module>
.AdminSection {
	display: flex;
	flex-direction: column;
	gap: 2.4rem;
	width: 100%;
	min-width: 0;
}

.tiles {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
	gap: 1.2rem;
}

.tile {
	padding: 1.6rem;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 1rem;
	display: grid;
	gap: 0.4rem;

	&._alert {
		border-color: rgba($error, 0.6);
	}
}

.tileLabel {
	font-size: 1.1rem;
	color: $gray4;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.tileValue {
	font-size: 3.2rem;
	font-variant-numeric: tabular-nums;
}

.tileHint {
	font-size: 1.1rem;
	color: $gray3;
}

.panel {
	display: grid;
	gap: 1.2rem;
}

.panelTitle {
	font-size: 1.4rem;
	color: $gray4;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.chart {
	position: relative;
	height: 32rem;
}

.chartCanvas {
	height: 100%;
}

.num {
	text-align: right;
	font-variant-numeric: tabular-nums;
}

.nowrap {
	white-space: nowrap;
}

.link {
	color: inherit;

	&:hover {
		color: $accent-light;
	}
}

.error {
	margin: 0;
	font-family: inherit;
	font-size: 1.2rem;
	white-space: pre-wrap;
	word-break: break-word;
}

.empty {
	padding: 2rem 0;
	color: $gray4;
}
</style>

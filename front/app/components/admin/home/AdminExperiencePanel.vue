<script setup lang="ts">
import type { IFormDataExp } from "#shared/types/experience.types";
import type { HomeSkill } from "~~/generated/prisma/client";

const props = defineProps<{
	item: IFormDataExp;
	index: number;
	skills: HomeSkill[];
}>();

const isRemoving = ref<boolean>(false);

const formData = ref<IFormDataExp>(props.item);
const skillItem = ref<HomeSkill[][]>([[], []]);

skillItem.value[0] = props.skills;
skillItem.value[1] = formData.value.stack;

const emit = defineEmits<{
	remove: [{ index?: number; id?: string }];
	change: [item: IFormDataExp];
}>();

watch(
	() => formData,
	() => {
		emit("change", formData.value);
	},
	{
		deep: true,
	},
);

const removeItem = async (index: number) => {
	isRemoving.value = true;
	emit("remove", {
		index: index,
		id: formData.value?.id,
	});
};

const setStack = (value: HomeSkill[][]) => {
	formData.value.stack = value[1] || [];
};
</script>
<template>
	<PrimePanel
		:header="formData.position_en || 'New experience'"
		toggleable
		:collapsed="props.index !== 0"
	>
		<template #icons>
			<PrimeButton
				:class="$style.removeBtn"
				:loading="isRemoving"
				icon="pi pi-trash"
				@click="removeItem(index)"
			/>
		</template>
		<div :class="$style.form">
			<div :class="$style.row">
				<PrimeInputNumber
					v-model="formData.order"
					inputId="horizontal-buttons"
					showButtons
					buttonLayout="horizontal"
				>
					<template #incrementbuttonicon>
						<span class="pi pi-plus" />
					</template>
					<template #decrementbuttonicon>
						<span class="pi pi-minus" />
					</template>
				</PrimeInputNumber>
				<PrimeFloatLabel variant="on">
					<PrimeInputText
						id="position_en"
						v-model="formData.position_en"
					/>
					<label for="position_en">Position_en</label>
				</PrimeFloatLabel>
				<PrimeFloatLabel variant="on">
					<PrimeInputText
						id="position_ru"
						v-model="formData.position_ru"
					/>
					<label for="position_ru">Position_ru</label>
				</PrimeFloatLabel>
				<PrimeFloatLabel variant="on">
					<PrimeInputText
						id="company_en"
						v-model="formData.company_en"
					/>
					<label for="company_en">Company_en</label>
				</PrimeFloatLabel>
				<PrimeFloatLabel variant="on">
					<PrimeInputText
						id="company_ru"
						v-model="formData.company_ru"
					/>
					<label for="company_ru">Company_ru</label>
				</PrimeFloatLabel>
			</div>
			<div :class="$style.block">
				<div>Period</div>
				<div>
					<PrimeCheckbox
						inputId="is_current"
						size="large"
						binary
						v-model="formData.isPresent"
					/>
					<label for="is_current"> Current </label>
				</div>
				<PrimeFloatLabel variant="on">
					<PrimeDatePicker
						v-model="formData.startDate"
						inputId="is_start"
						showIcon
						iconDisplay="input"
						view="month"
						dateFormat="mm/yy"
					/>
					<label for="is_start">Start date</label>
				</PrimeFloatLabel>
				<PrimeFloatLabel v-if="!formData.isPresent" variant="on">
					<PrimeDatePicker
						v-model="formData.endDate"
						inputId="is_end"
						showIcon
						iconDisplay="input"
						view="month"
						dateFormat="mm/yy"
					/>
					<label for="is_end">End date</label>
				</PrimeFloatLabel>
			</div>
			<div :class="$style.block">
				<div>Stack</div>
				<PrimePickList
					v-model="skillItem"
					dataKey="id"
					@update:modelValue="setStack"
				>
					<template #option="{ option }">
						{{ option.label }}
					</template>
				</PrimePickList>
			</div>
			<div :class="$style.block">
				<span>Responsibilities_en</span>
				<PrimeEditor
					:class="$style.editor"
					editorStyle="height: 180px"
					v-model="formData.responsibilities_en"
				/>
			</div>
			<div :class="$style.block">
				<span>Responsibilities_ru</span>
				<PrimeEditor
					:class="$style.editor"
					editorStyle="height: 180px"
					v-model="formData.responsibilities_ru"
				/>
			</div>
		</div>
	</PrimePanel>
</template>

<style module lang="scss">
.form {
	display: grid;
	gap: 2.4rem;
	padding-top: 1.6rem;
}

.row {
	display: flex;
	gap: 2rem;
}

.block {
	display: grid;
	gap: 2rem;
}
</style>

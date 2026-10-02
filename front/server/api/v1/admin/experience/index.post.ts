import type { IFormDataExp } from "#shared/types/experience.types";

export default defineEventHandler(async (event) => {
	const body = await readBody<IFormDataExp[]>(event);

	for (const item of body) {
		const itemData = {
			company_en: item.company_en || "",
			position_en: item.position_en || "",
			// выводятся через v-html
			responsibilities_en: sanitizePostHtml(item.responsibilities_en),
			company_ru: item.company_ru || "",
			position_ru: item.position_ru || "",
			responsibilities_ru: sanitizePostHtml(item.responsibilities_ru),
			startDate: item.startDate || new Date(),
			endDate: item.endDate || new Date(),
			isPresent: item.isPresent || false,
			order: item.order || 0,
		};
		const stack = item.stack.map((s) => ({ id: s.id }));

		if (item?.id) {
			await prisma.homeExperience.update({
				where: { id: item.id },
				// set, а не connect: снятые в форме навыки должны отвязываться
				data: { ...itemData, stack: { set: stack } },
			});
		} else {
			await prisma.homeExperience.create({
				data: { ...itemData, stack: { connect: stack } },
			});
		}
	}

	return true;
});

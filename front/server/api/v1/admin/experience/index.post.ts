import type { IFormDataExp } from "#shared/types/experience.types";

export default defineEventHandler(async (event) => {
	const body = await readBody<IFormDataExp[]>(event);

	for (const item of body) {
		const itemData = {
			company_en: item.company_en || "",
			position_en: item.position_en || "",
			responsibilities_en: item.responsibilities_en || "",
			company_ru: item.company_ru || "",
			position_ru: item.position_ru || "",
			responsibilities_ru: item.responsibilities_ru || "",
			startDate: item.startDate || new Date(),
			endDate: item.endDate || new Date(),
			isPresent: item.isPresent || false,
			stack: {
				connect: item.stack.map((s) => ({ id: s.id })),
			},
			order: item.order || 0,
		};

		if (item?.id) {
			await prisma.homeExperience.update({
				where: { id: item.id },
				data: itemData,
			});
		} else {
			await prisma.homeExperience.create({
				data: itemData,
			});
		}
	}

	return true;
});

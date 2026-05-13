import type { IFormDataProject } from "#shared/types/experience.types";

export default defineEventHandler(async (event) => {
	const body = await readBody<IFormDataProject[]>(event);

	for (const item of body) {
		const itemData = {
			company: item.company || "",
			position: item.position || "",
			startDate: item.startDate || new Date(),
			endDate: item.endDate || new Date(),
			isPresent: item.isPresent || false,
			stack: {
				connect: item.stack.map((s) => ({ id: s.id })),
			},
			responsibilities: item.responsibilities || "",
			order: item.order || 0,
			lang: item.lang || "en",
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

export default defineEventHandler(async (event) => {
	const body = await readBody<{
		items?: Array<{ id?: string; icon: string; label: string }>;
	}>(event);

	if (!body?.items || !Array.isArray(body.items)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Items are required",
		});
	}

	const items = body.items.map((item, index) => ({
		...item,
		order: index,
	}));

	const existing = await prisma.homeSkill.findMany({
		select: { id: true },
	});

	const existingIds = new Set(existing.map((item) => item.id));
	const incomingIds = new Set(items.map((item) => item.id).filter(Boolean) as string[]);
	const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));

	const ops = items.flatMap((item) => {
		if (item.id) {
			return prisma.homeSkill.update({
				where: { id: item.id },
				data: {
					icon: item.icon || "",
					label: item.label || "",
					order: item.order,
				},
			});
		}
		return prisma.homeSkill.create({
			data: {
				icon: item.icon || "",
				label: item.label || "",
				order: item.order,
			},
		});
	});

	if (toDelete.length) {
		// ops.push(
		// 	prisma.homeSkill.deleteMany({
		// 		where: { id: { in: toDelete } },
		// 	}),
		// );
	}

	// if (ops.length) {
	// 	await prisma.$transaction(ops);
	// }

	return { data: true };
});

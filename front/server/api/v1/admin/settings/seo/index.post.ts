export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	if (body?.id) {
		const current = await prisma.settingsSeo.findUnique({
			where: { id: body.id },
			select: { image: true },
		});

		for (const item of body.content) {
			const formatItem = {
				lang: item.lang,
				title: item.title,
				description: item.description,
				link: item.link,
				author: item.author,
				settingsSeoId: body.id,
			};

			await prisma.settingsSeoContent.upsert({
				where: {
					lang: item.lang,
				},
				update: formatItem,
				create: formatItem,
			});
		}

		await prisma.settingsSeo.update({
			where: { id: body.id },
			data: {
				image: body.image,
			},
		});

		await deleteReplacedUploads([current?.image], [body.image]);
	} else {
		await prisma.settingsSeo.create({
			data: {
				image: body.image,
				content: {
					createMany: {
						data: body.content,
					},
				},
			},
		});
	}

	return true;
});

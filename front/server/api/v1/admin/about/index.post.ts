interface IText {
	id?: string;
	lang: string;
	text: string;
}

interface IBody {
	id?: string;
	image: string;
	text: IText[];
}

export default defineEventHandler(async (event) => {
	const body = await readBody<IBody>(event);

	if (body?.id) {
		for (const item of body.text) {
			if (item?.id) {
				await prisma.homeAboutText.update({
					where: {
						id: item.id,
					},
					data: {
						lang: item.lang,
						text: item.text,
					},
				});
			} else if (item.text) {
				await prisma.homeAboutText.create({
					data: {
						lang: item.lang,
						text: item.text,
						homeAboutId: body.id,
					},
				});
			}
		}

		await prisma.homeAbout.update({
			where: { id: body.id },
			data: {
				image: body.image
			},
		});
	} else {
		await prisma.homeAbout.create({
			data: {
				image: body.image,
				text: {
					createMany: {
						data: body.text,
					},
				},
			},
		});
	}

	return true;
});

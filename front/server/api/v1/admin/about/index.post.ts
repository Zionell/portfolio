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
	// текст выводится через v-html
	const texts = (body?.text || []).map((item) => ({
		...item,
		text: sanitizePostHtml(item.text),
	}));

	if (body?.id) {
		const current = await prisma.homeAbout.findUnique({
			where: { id: body.id },
			select: { image: true },
		});

		for (const item of texts) {
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

		await deleteReplacedUploads([current?.image], [body.image]);
	} else {
		await prisma.homeAbout.create({
			data: {
				image: body.image,
				text: {
					createMany: {
						data: texts.map(({ lang, text }) => ({ lang, text })),
					},
				},
			},
		});
	}

	return true;
});

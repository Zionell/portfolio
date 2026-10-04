interface ISkill {
	label: string;
	icon: string;
	order: number;
}

export default defineEventHandler(async (event) => {
	const body = await readBody<ISkill>(event);

	await prisma.homeSkill.create({
		data: {
			label: body.label,
			// иконка выводится через v-html
			icon: sanitizeSvg(body.icon),
			order: body.order || 0,
		},
	});

	return true;
});

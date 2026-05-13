interface ISkill {
	label: string;
	icon: string;
	order: number;
}

export default defineEventHandler(async (event) => {
	const body = await readBody<ISkill>(event);

	await prisma.homeSkill.create({
		data: body
	});

	return true;
});

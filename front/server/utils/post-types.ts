import type { PostsType } from "~~/generated/prisma/client";

// Типов ровно два, из админки новые не заводятся
const POST_TYPES = [
	{ label_en: "Post", label_ru: "Пост" },
	{ label_en: "News", label_ru: "Новости" },
];

// SSR и гидрация дёргают specs параллельно: без общего промиса
// оба запроса не находят типов и создают их по второму разу
let pending: Promise<PostsType[]> | null = null;

const resolvePostTypes = async (): Promise<PostsType[]> => {
	const existing = await prisma.postsType.findMany();
	const types: PostsType[] = [];

	for (const type of POST_TYPES) {
		// find, а не filter: дубли из прошлых гонок в выдачу не попадают
		const found = existing.find((item) => item.label_en === type.label_en);

		types.push(found || (await prisma.postsType.create({ data: type })));
	}

	return types;
};

export function ensurePostTypes(): Promise<PostsType[]> {
	if (!pending) {
		pending = resolvePostTypes().finally(() => {
			pending = null;
		});
	}

	return pending;
}

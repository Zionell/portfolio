import type { IPostGenerationError } from "#shared/types/analytics.types";

const LIMIT = 100;

export default defineEventHandler(async (): Promise<IPostGenerationError[]> => {
	const errors = await prisma.postGenerationError.findMany({
		orderBy: { createdAt: "desc" },
		take: LIMIT,
	});

	return errors.map((error) => ({
		...error,
		createdAt: error.createdAt.toISOString(),
	}));
});

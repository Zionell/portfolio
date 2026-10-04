// update/delete по несуществующей записи Prisma бросает P2025 —
// без перехвата клиент получает 500 вместо 404
export const notFoundIfMissing = <T>(query: Promise<T>): Promise<T> =>
	query.catch((error) => {
		if ((error as { code?: string })?.code === "P2025") {
			throw createError({ statusCode: 404, statusMessage: "Not Found" });
		}

		throw error;
	});

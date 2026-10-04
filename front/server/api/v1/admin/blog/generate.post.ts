// Ручной запуск того же сценария, что и субботний крон
export default defineEventHandler(async () => {
	try {
		return await generateWeeklyPost("manual");
	} catch (error) {
		console.error("[weekly-post] ручная генерация не удалась", error);

		throw createError({
			statusCode: 502,
			statusMessage: "Failed to generate post",
		});
	}
});

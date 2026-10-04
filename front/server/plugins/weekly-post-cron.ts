import { Cron } from "croner";

// Встроенные scheduledTasks Nitro не умеют в таймзону и считают время
// по часам сервера, поэтому планируем сами: каждую субботу в 10:00 МСК
const WEEKLY_POST_CRON = "0 10 * * 6";

export default defineNitroPlugin((nitroApp) => {
	if (import.meta.prerender) return;

	const job = new Cron(
		WEEKLY_POST_CRON,
		{ name: "weekly-post", timezone: "Europe/Moscow", protect: true },
		async () => {
			try {
				const post = await generateWeeklyPost("cron");

				if (post) {
					console.info("[weekly-post] создан черновик", post.id);
				} else {
					console.info("[weekly-post] нет свободных скелетонов");
				}
			} catch (error) {
				console.error("[weekly-post] генерация не удалась", error);
			}
		},
	);

	// в dev при перезапуске сервера иначе копились бы дубли задачи
	nitroApp.hooks.hook("close", () => job.stop());
});

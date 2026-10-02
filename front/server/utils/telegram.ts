export const escapeTelegramHtml = (value: string): string =>
	value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Уведомления вспомогательные: без настроек или при ошибке Telegram
// основной сценарий не падает
export async function sendTelegramMessage(html: string): Promise<void> {
	const token = process.env.TELEGRAM_BOT_TOKEN;
	const chatId = process.env.TELEGRAM_CHAT_ID;

	if (!token || !chatId) {
		console.warn(
			"[telegram] TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы, уведомление пропущено",
		);
		return;
	}

	try {
		await $fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
			method: "POST",
			body: {
				chat_id: chatId,
				text: html,
				parse_mode: "HTML",
				disable_web_page_preview: true,
			},
		});
	} catch (error) {
		console.error("[telegram] не удалось отправить уведомление", error);
	}
}

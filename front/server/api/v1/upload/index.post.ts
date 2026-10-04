import type { ServerFile } from "nuxt-file-storage";

// Потолок на файл. Файл приходит data URL'ом в JSON, base64 раздувает его
// на треть — client_max_body_size на location /api/v1/upload в nginx
// посчитан с этим запасом: тот режет запрос раньше, здесь — страховка
// на случай обращения мимо прокси
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export default defineEventHandler(async (event) => {
	const body = await readBody<{ file?: ServerFile }>(event);
	const file = body?.file;

	if (!file?.content || typeof file.content !== "string") {
		throw createError({ statusCode: 400, statusMessage: "File is required" });
	}

	// Формат определяем сами по имени файла: MIME в data URL присылает
	// клиент, и доверять ему нельзя — файл мог назваться страницей и
	// открыться на нашем домене
	const ext = resolveUploadExtension(file.name);

	if (!ext || !file.content.startsWith("data:image/")) {
		throw createError({
			statusCode: 415,
			statusMessage: "Only jpg, png, webp, avif and gif are allowed",
		});
	}

	// размер из поля size тоже клиентский, считаем по самим данным
	const base64 = file.content.slice(file.content.indexOf(",") + 1);

	if (Math.floor((base64.length * 3) / 4) > MAX_UPLOAD_BYTES) {
		throw createError({
			statusCode: 413,
			statusMessage: `File is too large, limit is ${MAX_UPLOAD_BYTES / 1024 / 1024}MB`,
		});
	}

	try {
		// имя генерирует модуль, расширение берёт из file.name — уже проверено
		const filename = await storeFileLocally(file, 16);

		return { url: `${UPLOADS_PUBLIC_PATH}/${filename}` };
	} catch (error) {
		console.error("[upload] не удалось сохранить файл", error);

		throw createError({
			statusCode: 500,
			statusMessage: "Failed to save the file",
		});
	}
});

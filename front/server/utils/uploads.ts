import { extname } from "node:path";

// Всё, что грузится из админки, лежит в fileStorage.mount (storage/uploads,
// вне public), а наружу отдаётся под этим префиксом
export const UPLOADS_PUBLIC_PATH = "/uploads";

export const MIME_BY_EXT: Record<string, string> = {
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".webp": "image/webp",
	".avif": "image/avif",
	".gif": "image/gif",
};

export const resolveUploadExtension = (filename?: string): string | null => {
	const ext = extname(filename || "").toLowerCase();

	return ext in MIME_BY_EXT ? ext : null;
};

type MaybeUrl = string | null | undefined;

// Удаляем только свои загрузки: в полях картинок бывают и ссылки на
// public/images, и внешние адреса
export const deleteUploads = async (urls: MaybeUrl[]) => {
	const prefix = `${UPLOADS_PUBLIC_PATH}/`;

	for (const url of new Set(urls)) {
		if (!url?.startsWith(prefix)) continue;

		try {
			await deleteFile(url.slice(prefix.length));
		} catch (error) {
			// запись в БД уже сохранена, из-за мусора на диске её не откатываем
			if ((error as NodeJS.ErrnoException)?.code !== "ENOENT") {
				console.error("[uploads] не удалось удалить", url, error);
			}
		}
	}
};

// Вызывать после успешной записи в БД: иначе при ошибке сохранения
// запись осталась бы со ссылкой на уже удалённый файл
export const deleteReplacedUploads = (before: MaybeUrl[], after: MaybeUrl[]) => {
	const kept = new Set(after.filter(Boolean));

	return deleteUploads(before.filter((url) => url && !kept.has(url)));
};

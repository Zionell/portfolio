import { createReadStream, promises as fs } from "node:fs";

// Загрузки лежат вне public/, поэтому Nitro сам их не отдаёт — только отсюда
export default defineEventHandler(async (event) => {
	const name = getRouterParam(event, "name") || "";
	const ext = resolveUploadExtension(name);

	if (!ext) {
		throw createError({ statusCode: 404, statusMessage: "Not Found" });
	}

	// getFileLocally не выпускает путь за пределы fileStorage.mount
	const filePath = getFileLocally(name);
	const stats = await fs.stat(filePath).catch(() => null);

	if (!stats?.isFile()) {
		throw createError({ statusCode: 404, statusMessage: "Not Found" });
	}

	setResponseHeaders(event, {
		"Content-Type": MIME_BY_EXT[ext],
		"Content-Length": String(stats.size),
		// имена случайные и не переиспользуются
		"Cache-Control": "public, max-age=31536000, immutable",
	});

	return sendStream(event, createReadStream(filePath));
});

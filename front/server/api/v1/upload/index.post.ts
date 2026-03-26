import { promises as fs } from "node:fs";
import { join, extname } from "node:path";

export default defineEventHandler(async (event) => {
	const form = await readMultipartFormData(event);
	if (!form) {
		throw createError({ statusCode: 400, statusMessage: "No form data" });
	}

	const file = form.find((item) => item.name === "file");
	const sectionField = form.find((item) => item.name === "section");
	const sectionRaw = typeof sectionField?.data === "string" ? sectionField.data : "misc";

	if (!file || !file.data) {
		throw createError({ statusCode: 400, statusMessage: "File is required" });
	}

	const section = sectionRaw.toLowerCase().replace(/[^a-z0-9-_]/g, "") || "misc";
	const ext = extname(file.filename || "") || ".jpg";
	const fileName = `${Date.now().toString(36)}${ext}`;

	const uploadDir = join(process.cwd(), "public", "images", section);
	await fs.mkdir(uploadDir, { recursive: true });
	await fs.writeFile(join(uploadDir, fileName), file.data);

	return { url: `/images/${section}/${fileName}` };
});

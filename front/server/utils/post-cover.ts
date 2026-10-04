import sharp from "sharp";

export const POST_COVER_WIDTH = 1800;
export const POST_COVER_HEIGHT = 500;

// 1800x500 шире предельных для модели 3:1, поэтому режем по центру и масштабируем
export const savePostCover = async (base64: string | null): Promise<string> => {
	if (!base64) return "";

	const buffer = await sharp(Buffer.from(base64, "base64"))
		.resize(POST_COVER_WIDTH, POST_COVER_HEIGHT, {
			fit: "cover",
			position: "centre",
		})
		.webp({ quality: 88 })
		.toBuffer();

	const filename = await storeFileLocally(
		{
			name: "cover.webp",
			content: `data:image/webp;base64,${buffer.toString("base64")}`,
			size: "",
			type: "image/webp",
			lastModified: "",
		},
		16,
	);

	return `${UPLOADS_PUBLIC_PATH}/${filename}`;
};

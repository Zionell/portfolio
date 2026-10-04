import { api } from "~/assets/data/api.ts";

export const useAdminUpload = () => {
	const { files, handleFileInput } = useFileStorage();

	const uploadFile = async (file: File): Promise<string> => {
		await handleFileInput({ target: { files: [file] } });

		const response = await $fetch<{ url: string }>(api.admin.upload, {
			method: "POST",
			body: { file: files.value[0] },
		});
		return response.url;
	};

	return { uploadFile };
};

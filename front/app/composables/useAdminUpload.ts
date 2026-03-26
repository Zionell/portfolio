export const useAdminUpload = () => {
	const uploadFile = async (file: File, section: string): Promise<string> => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("section", section);
		const response = await $fetch<{ url: string }>("/api/v1/upload", {
			method: "POST",
			body: formData,
		});
		return response.url;
	};

	return { uploadFile };
};

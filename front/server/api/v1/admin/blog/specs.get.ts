import type { PostsType } from "~~/generated/prisma/client";

export default defineEventHandler(async (): Promise<PostsType[]> => {
	return ensurePostTypes();
});

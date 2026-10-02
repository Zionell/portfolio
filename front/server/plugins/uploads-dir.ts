import { mkdirSync } from "node:fs";

// nuxt-file-storage ждёт, что fileStorage.mount уже существует, а storage/
// в гит не попадает — на чистом checkout'е первая загрузка падала бы с ENOENT
export default defineNitroPlugin(() => {
	mkdirSync(useRuntimeConfig().public.fileStorage.mount, { recursive: true });
});

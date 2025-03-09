import { defineNuxtConfig } from "nuxt/config";
import headConfig from "./config/head.config";
import type { IEnv } from "assets/interfaces/interface";
import upath from "upath";
import path from "path";

const pathAssets = upath.toUnix(path.resolve(__dirname, "./assets"));
const env: IEnv = {
	SERVER_API: process.env.SERVER_API || "",
	DEVELOPMENT: process.env.NODE_ENV === "development",
};

const breakpoints = {
	mobile: 767,
	tablet: 1279,
	laptop: 1439,
	desktop: 999999,
};

export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",

	// Modules
	modules: ["@pinia/nuxt", "@nuxt/image", "@nuxt/icon", "@nuxtjs/device"],

	// Icons
	icon: {
		localApiEndpoint: "/icons/_nuxt_icon",
		mode: "svg",
		customCollections: [
			{
				prefix: "icons",
				dir: "./assets/icons",
			},
		],
	},

	// Auto import UI components
	components: [
		{
			path: "~/components",
			extensions: [".vue"],
			pathPrefix: false,
		},
	],

	// Store
	pinia: {
		storesDirs: ["./store/**"],
	},

	// Nuxt images module
	image: {
		inject: true,
		provider: "customProvider",

		screens: { ...breakpoints, desktop: 1920 },

		intersectOptions: {
			rootMargin: "50px",
		},

		presets: {
			preview: {
				modifiers: {
					quality: 30,
					blur: 60,
				},
			},
		},

		providers: {
			customProvider: {
				provider: "~/config/imageProvider",
				options: {
					baseURL: env.SERVER_API,
					staticFolder: "/images", // redirect to internal url, if url from static folder
					quality: 80, // Default quality
				},
			},
		},
	}, // Image end

	css: ["assets/style/style.scss", "assets/style/bundle.scss"],

	app: {
		head: headConfig,
	},

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					api: "modern-compiler",
					additionalData: `
                        @use "${pathAssets}/style/shared/vars" as *;
                        @use "${pathAssets}/style/shared/function" as *;
                        @use "${pathAssets}/style/shared/mixins" as *;
                    `,
				},
			},
		},
	},
});

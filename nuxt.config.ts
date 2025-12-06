import { defineNuxtConfig } from "nuxt/config";
import headConfig from "./config/head.config";
import type { IEnv } from "~/assets/types/types";

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
	modules: ["@nuxt/image", "@nuxt/icon", "@nuxtjs/device"],

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

	// Nuxt images module
	image: {
		screens: { ...breakpoints, desktop: 1920 },

		presets: {
			preview: {
				modifiers: {
					quality: 30,
					blur: 60,
				},
			},
		},
	}, // Image end

	css: ["assets/style/style.scss", "assets/style/bundle.scss"],

	app: {
		head: headConfig,
	},

	vite: {
		build: {
			minify: "esbuild",
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `
                        @use "assets/style/shared/vars" as *;
                        @use "assets/style/shared/function" as *;
                        @use "assets/style/shared/mixins" as *;
                    `,
				},
			},
		},
	},
});

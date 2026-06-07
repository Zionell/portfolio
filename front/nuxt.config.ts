import Nora from "@primeuix/themes/nora";
import glsl from "vite-plugin-glsl";

const breakpoints = {
	mobile: 767,
	tablet: 1279,
	laptop: 1439,
	desktop: 999999,
};

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",

	devtools: { enabled: false },

	// Modules
	modules: [
		"@nuxt/image",
		"@nuxt/icon",
		"@nuxtjs/device",
		"@nuxtjs/i18n",
		"@primevue/nuxt-module",
	],

	// PrimeVue
	primevue: {
		autoImport: true,
		components: {
			prefix: "Prime",
		},
		options: {
			theme: {
				preset: Nora,
			},
		},
	},

	// I18n
	i18n: {
		baseUrl: "https://askarov.dev/",
		strategy: "no_prefix",
		defaultLocale: "en",
		locales: [
			{ code: "en", language: "en-US", name: "EN", file: "en.json" },
			{ code: "ru", language: "ru-Ru", name: "RU", file: "ru.json" },
		],
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: "i18n_redirected",
			redirectOn: "root",
		},
	},

	// Icons
	icon: {
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

	css: ["~/assets/style/style.scss"],

	vite: {
		plugins: [glsl()],
		build: {
			minify: "esbuild",
			commonjsOptions: {
				include: [/eventemitter3/, /quill-delta/, /node_modules/],
			},
		},
		optimizeDeps: {
			include: ["@vueuse/core", "quill-delta", "eventemitter3", "gsap"],
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `
                        @use "~/assets/style/shared" as *;
                    `,
				},
			},
		},
	},
});

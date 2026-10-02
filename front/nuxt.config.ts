import { join } from "node:path";
import { fileURLToPath } from "node:url";
import Nora from "@primeuix/themes/nora";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

const storageRoot = join(rootDir, "storage");
const storageDir = join(storageRoot, "uploads");

const isDev = process.env.NODE_ENV !== "production";

const breakpoints = {
	mobile: 767,
	tablet: 1279,
	laptop: 1439,
	desktop: 999999,
};

// Домены Метрики для CSP: сам tag.js проходит по strict-dynamic, а пиксели,
// запросы и вебвизор нужно разрешить явно
const yandexMetrika = {
	http: ["https://mc.yandex.ru", "https://mc.yandex.com"],
	ws: ["wss://mc.yandex.ru", "wss://mc.yandex.com"],
};

// статику и картинки лимитом не считаем: одна страница тянет десятки файлов
const noRateLimit = { security: { rateLimiter: false as const } };

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",

	devtools: { enabled: false },

	runtimeConfig: {
		session: {
			name: "admin_session",
			maxAge: 60 * 60 * 24 * 14,
			cookie: {
				httpOnly: true,
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
			},
		},
		adminPassword: "",
		skeletonApiToken: "",
		public: {
			// NUXT_PUBLIC_YANDEX_METRIKA_ID, пусто — Метрика не грузится
			yandexMetrikaId: "",
		},
	},

	// Modules
	modules: [
		"@nuxt/image",
		"@nuxt/icon",
		"@nuxtjs/device",
		"@nuxtjs/i18n",
		"@primevue/nuxt-module",
		"nuxt-file-storage",
		"nuxt-auth-utils",
		"nuxt-security",
	],

	fileStorage: {
		mount: storageDir,
	},

	// Security
	security: {
		nonce: true,

		contentSecurityPolicyReportOnly: true,

		headers: {
			contentSecurityPolicy: {
				"default-src": ["'self'"],
				// nonce ставится на все скрипты из useHead, включая скрипты из админки;
				// strict-dynamic доверяет тому, что они подгрузят сами
				"script-src": [
					"'self'",
					"'nonce-{{nonce}}'",
					"'strict-dynamic'",
					"https:",
				],
				"script-src-attr": ["'none'"],
				// PrimeVue и Quill вставляют стили в рантайме, SSR рендерит style=""
				"style-src": ["'self'", "'unsafe-inline'"],
				"img-src": ["'self'", "data:", "blob:", ...yandexMetrika.http],
				"font-src": ["'self'", "data:"],
				"connect-src": [
					"'self'",
					...yandexMetrika.http,
					...yandexMetrika.ws,
				],
				// вебвизор Метрики открывает свой iframe
				"frame-src": ["'self'", ...yandexMetrika.http],
				"object-src": ["'none'"],
				"base-uri": ["'none'"],
				"form-action": ["'self'"],
				"frame-ancestors": ["'self'"],
				// весь контент со своего origin, а с TLS_MODE=off апгрейд сломает сайт
				"upgrade-insecure-requests": false,
			},
			// require-corp/credentialless режет внешние ресурсы без CORP-заголовка
			crossOriginEmbedderPolicy: false,
			// эти три отдаёт nginx для всех ответов, включая статику
			xContentTypeOptions: false,
			xFrameOptions: false,
			referrerPolicy: false,
		},

		rateLimiter: {
			tokensPerInterval: 300,
			interval: 5 * 60 * 1000,
			// nginx перезаписывает X-Real-IP адресом клиента; первый элемент
			// X-Forwarded-For, который берёт модуль по умолчанию, подделывается
			ipHeader: isDev ? undefined : "x-real-ip",
		},
		// лимит 8MB сломает загрузку картинок, nginx пускает до 30M
		requestSizeLimiter: false,
		// HTML из админки (посты, about, скрипты) чистится на сохранении сам
		xssValidator: false,
		// иначе из прод-сборки вырезаются console.* — пропадут логи сервера
		removeLoggers: false,
	},

	routeRules: {
		"/_nuxt/**": noRateLimit,
		"/_ipx/**": noRateLimit,
		"/uploads/**": noRateLimit,

		// подбор пароля: 10 попыток за 15 минут с одного IP
		"/api/v1/auth/login": {
			security: {
				rateLimiter: {
					tokensPerInterval: 10,
					interval: 15 * 60 * 1000,
				},
			},
		},
	},

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

		ipx: {
			fs: {
				dir: [
					join(rootDir, isDev ? "public" : ".output/public"),
					storageRoot,
				],
			},
		},

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

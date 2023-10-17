import { defineNuxtConfig } from 'nuxt/config';
import headConfig from './config/head.config';
import { IEnv } from 'assets/interfaces/interface';
import {NuxtOptionsHead} from "@nuxt/types/config/head";

const env: IEnv = {
    SERVER_API: process.env.SERVER_API || '',
    DEVELOPMENT: process.env.NODE_ENV === 'development',
};

const breakpoints = {
    mobile: 767,
    tablet: 1279,
    laptop: 1439,
    desktop: 999999,
};

export default defineNuxtConfig(<NuxtOptionsHead>{
    // Modules
    modules: [
        '@pinia/nuxt',
        'nuxt-svgo',
        '@nuxt/image',
        '@nuxtjs/device',
    ],

    devtools: {
        enabled: true,
    },

    device: {
        refreshOnResize: true
    },

    // Store
    pinia: {
        autoImports: [
            'defineStore',
        ],
    },

    // Svg
    svgo: {
        autoImportPath: './assets/svg/',
    },

    // Nuxt images module
    image: {
        inject: true,
        domains: [env.SERVER_API],
        screens: { ...breakpoints, desktop: 1920 },

        intersectOptions: {
            rootMargin: '50px',
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
                name: 'customProvider',
                provider: '~/config/imageProvider',
                options: {
                    baseURL: env.SERVER_API,
                },
            },
        },
    }, // Image end

    imports: {
        dirs: [
            'store',
        ],
    },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "assets/style/bundle.scss" as *;',
                },
            },
        },
    },

    css: ['assets/style/style.scss'],

    app: {
        head: headConfig,
    },
});

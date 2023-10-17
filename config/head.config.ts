import {faviconsLinks, faviconsMeta} from "./head/favicons";
import {headNoScripts, headScripts} from "./head/scripts";
import {NuxtOptionsHead} from "@nuxt/types/config/head";


const headConfig: NuxtOptionsHead = {
    htmlAttrs: {lang: 'ru'},

    // TODO: Set site title
    title: 'Сайт-портфолио Аскаров Адилхан',

    // Head meta
    meta: [
        {
            charset: 'utf-8'},
        {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1'
        },

        // TODO: Set site description
        {
            hid: 'description',
            name: 'description',
            content: 'Сайт-портфолио Аскаров Адилхан. Фронтенд-разработчик. Создание адаптивных и кроссбраузерных веб-сайтов на Vue, React.'},
        {
            name: 'theme-color',
            content: '#111'
        },
        {
            name: 'apple-mobile-web-app-capable',
            content: 'yes'
        },
        {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black-translucent'
        },


        {
            hid: 'og:type',
            name: 'og:type',
            content: 'website',
        },
        {
            hid: 'og:url',
            name: 'og:url',
            content: 'https://askarov.dev/',
        },
        {
            hid: 'og:title',
            name: 'og:title',
            content: 'Сайт-портфолио Аскаров Адилхан',
        },
        {
            hid: 'og:description',
            name: 'og:description',
            content: 'Сайт-портфолио Аскаров Адилхан. Фронтенд-разработчик. Создание адаптивных и кроссбраузерных веб-сайтов на Vue, React.',
        },
        {
            hid: 'og:image',
            name: 'og:image',
            content: '/images/seo.png',
        },

        {
            hid: 'twitter:url',
            name: 'twitter:url',
            content: 'https://askarov.dev/',
        },
        {
            hid: 'twitter:title',
            name: 'twitter:title',
            content: 'Сайт-портфолио Аскаров Адилхан',
        },
        {
            hid: 'twitter:description',
            name: 'twitter:description',
            content: 'Сайт-портфолио Аскаров Адилхан. Фронтенд-разработчик. Создание адаптивных и кроссбраузерных веб-сайтов на Vue, React.',
        },
        {
            hid: 'twitter:image',
            name: 'twitter:image',
            content: '/images/seo.png',
        },
        {
            hid: 'twitter:card',
            name: 'twitter:card',
            content: 'summary_large_image',
        },


        // Favicons
        ...faviconsMeta,
    ],

    // Head links
    link: [
        // Favicons
        ...faviconsLinks,
    ],

    script: process.env.GTM !== 'False'
        ? [...headScripts]
        : [],
    //
    noscript: process.env.GTM !== 'False'
        ? [...headNoScripts]
        : [],
};

export default headConfig;

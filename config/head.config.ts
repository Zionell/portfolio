import {faviconsLinks, faviconsMeta} from "./head/favicons";
import {headNoScripts, headScripts} from "./head/scripts";

const title = 'Portfolio Website of Adilkhan Askarov'
const description = 'Portfolio Website of Adilkhan Askarov. Frontend Developer. Creating responsive and cross-browser websites using Vue, React, Nuxt, Next.'
const link = 'https://askarov.dev/'
const image = '/images/seo.jpg'

const headConfig = {
    htmlAttrs: {lang: 'en'},

    title: title,

    // Head meta
    meta: [
        {
            charset: 'utf-8'
        },
        {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
        },

        {
            hid: 'description',
            name: 'description',
            content: description
        },
        {
            hid: "yandex-verification",
            name: "yandex-verification",
            content: "bece835da23b4c90",
        },
        { name: 'theme-color', content: '#111' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },

        {
            hid: 'og:type',
            name: 'og:type',
            content: 'website',
        },
        {
            hid: 'og:url',
            name: 'og:url',
            content: link,
        },
        {
            hid: 'og:title',
            name: 'og:title',
            content: title,
        },
        {
            hid: 'og:description',
            name: 'og:description',
            content: description,
        },
        {
            hid: 'og:image',
            name: 'og:image',
            content: image,
        },

        {
            hid: 'twitter:url',
            name: 'twitter:url',
            content: link,
        },
        {
            hid: 'twitter:title',
            name: 'twitter:title',
            content: title,
        },
        {
            hid: 'twitter:description',
            name: 'twitter:description',
            content: description,
        },
        {
            hid: 'twitter:image',
            name: 'twitter:image',
            content: image,
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

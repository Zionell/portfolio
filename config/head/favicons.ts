const faviconsLinks = [
    {
        rel: 'icon',
        href: '/favicons/favicon.ico',
    },
    {
        rel: 'apple-touch-icon',
        href: '/favicons/apple-touch-icon.png',
        sizes: '180x180',
    },
    {
        rel: 'icon',
        href: '/favicons/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
    },
    {
        rel: 'manifest',
        href: '/favicons/site.webmanifest',
        crossorigin: 'use-credentials',
    },
];

const faviconsMeta = [
    {
        name: 'msapplication-TileColor',
        content: '#fff',
    },
    {
        name: 'theme-color',
        content: '#fff',
    },
];

export { faviconsLinks, faviconsMeta };

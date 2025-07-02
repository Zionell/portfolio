const puppeteer = require('puppeteer')

const getImage = async (url, name) => {
    try {
        const browser = await puppeteer.launch({headless: 'new'});
        const page = await browser.newPage();
        await page.goto(url);
        // await page.waitForTimeout(1000);
        await page.setViewport({width: 1440, height: 900});
        await page.screenshot({path: `public/images/projects/${name}.jpg`})

        await browser.close()
    } catch (e) {
        console.warn('getImage', e)
        return e
    }
}

const generate = () => {
    const works = [
        // {
        //     slug: 'sarawan',
        //     link: 'https://sarawan.ru/',
        // },
        // {
        //     slug: 'lyaman',
        //     link: 'https://lyaman-askerova.kz/',
        // },
        // {
        //     slug: 'skshag',
        //     link: 'https://skshag.ru/',
        // },
        // {
        //     slug: 'livesimply',
        //     link: 'https://livesimply.site/',
        // },
        // {
        //     slug: 'tourmetria',
        //     link: 'https://tourmetria:tourmetria_secret_1@tourmetria.tsacloud.com/',
        // },
        // {
        //     slug: 'dachboard',
        //     link: 'https://dashboard.askarov.dev/',
        // },
        // {
        //     slug: 'topogeo',
        //     link: 'https://zionell.github.io/Topogeo/',
        // },
        // {
        //     slug: 'the-brand',
        //     link: 'https://zionell.github.io/The-brand/',
        // },
        // {
        //     slug: 'rendered',
        //     link: 'https://zionell.github.io/rendered/',
        // },
        // {
        //     slug: 'mogo',
        //     link: 'https://zionell.github.io/mogo/',
        // },
    ]

    works.forEach(w => getImage(w.link, w.slug))
}

module.exports = generate()

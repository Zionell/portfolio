import puppeteer from "puppeteer";

export const getImage = async (url: string, name: string) => {
    try {
        const browser = await puppeteer.launch({headless: 'new'});
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForTimeout(500);
        await page.setViewport({width: 1440, height: 900});
        const screen = await page.screenshot({path: `public/images/projects/${name}.jpg`})

        await browser.close()

        return screen
    } catch (e) {
        console.warn('getImage', e)
        return e
    }
}
// import puppeteer from "puppeteer";

export const getImage = async (url: string, name: string): Promise<string> => {
	try {
		// const browser = await puppeteer.launch();
		// const page = await browser.newPage();
		// await page.goto(url);
		// await page.waitForNetworkIdle({
		// 	idleTime: 1000,
		// });
		//
		// await page.setViewport({ width: 1440, height: 900 });
		// await page.screenshot({ path: `public/images/projects/${name}.jpg` });
		//
		// await browser.close();

		return `/images/projects/${name}.jpg`;
	} catch (e) {
		console.warn("getImage", e);
		return '/images/default.png'
	}
};


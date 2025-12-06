const puppeteer = require("puppeteer");

async function getImage(url, name) {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(url);
		// await page.waitForTimeout(1000);

		await page.setViewport({ width: 1440, height: 900 });
		await page.screenshot({ path: `public/images/projects/${name}.jpg` });

		await browser.close();
	} catch (e) {
		console.warn("getImage", e);
		return e;
	}
}

function generate() {
	const works = [
		// {
		//     label: 'sarawan',
		//     value: 'https://sarawan.ru/',
		// },
		// {
		//     label: 'skshag',
		//     value: 'https://skshag.ru/',
		// },
		// {
		//     label: 'livesimply',
		//     value: 'https://livesimply.site/',
		// },
		// {
		//     label: 'tourmetria',
		//     value: 'https://tourmetria:tourmetria_secret_1@tourmetria.tsacloud.com/',
		// },
		// {
		//     label: 'dachboard',
		//     value: 'https://dashboard.askarov.dev/',
		// },
		// {
		//     label: 'topogeo',
		//     value: 'https://zionell.github.io/Topogeo/',
		// },
		// {
		//     label: 'the-brand',
		//     value: 'https://zionell.github.io/The-brand/',
		// },
		// {
		//     label: 'rendered',
		//     value: 'https://zionell.github.io/rendered/',
		// },
		// {
		// 	label: "mogo",
		// 	value: "https://mogo-lyart.vercel.app/",
		// },
	];
	console.log("works", works);

	works.forEach((w) => getImage(w.value, w.label));
}

module.exports = generate();

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


const scripts = [
// Ya.Metrika
{
innerHTML: ` (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                       ym(95202040, "init", {
                            clickmap:true,
                            trackLinks:true,
                            accurateTrackBounce:true
                       });  `,
			async: true,
		},
	];

	const noScripts = [
		// Yandex
		{
			innerHTML:
				'<div><img src="https://mc.yandex.ru/watch/95202040" style="position:absolute; left:-9999px;" alt="" /></div>',
			body: true,
		},
	];

	const faviconsLinks = [
		{
			rel: "icon",
			href: "/favicons/favicon.ico",
		},
		{
			rel: "apple-touch-icon",
			href: "/favicons/apple-touch-icon.png",
			sizes: "180x180",
		},
		{
			rel: "icon",
			href: "/favicons/favicon-96x96.png",
			sizes: "64x64",
			type: "image/png",
		},
		{
			rel: "manifest",
			href: "/favicons/site.webmanifest",
			crossorigin: "use-credentials",
		} as const,
	];

	const seo = {
		title: "Adilkhan Askarov - frontend developer | ASKAROV.DEV",
		description: "Portfolio Website of Adilkhan Askarov. Frontend Developer. Creating responsive and cross-browser websites using Vue, React, Nuxt, Next.",
		link: "https://askarov.dev/",
		image: "/images/seo.jpg",
		author: "Adilkhan Askarov",
	}

	const social = [
		{
			name: "GitHub",
			icon: "github",
			link: "https://github.com/Zionell",
		},
		{
			name: "LinkedIn",
			icon: "linkedin",
			link: "https://www.linkedin.com/in/adilkhan-askarov-frontend/",
		},
		{
			name: "Instagram",
			icon: "instagram",
			link: "https://www.instagram.com/adilhan96/",
		},
		{
			name: "Telegram",
			icon: "telegram",
			link: "https://t.me/Adilhan96",
		},
		{
			name: "WhatsApp",
			icon: "whatsapp",
			link: "https://wa.me/79649346295",
		},
		// {
		// 	name: "Email",
		// 	icon: "email",
		// 	link: "mailto:studio.askarov@gmail.com",
		// },
	]


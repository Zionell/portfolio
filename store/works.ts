import {defineStore} from "pinia";
import {IWorkCard} from "~/assets/interfaces/interface";

type WorksType = {
    works: IWorkCard[]
}

export const useWorksStore = defineStore('works', {
    state: ():WorksType  => ({
        works: [
            {
                name: 'Sarawan',
                slug: 'sarawan',
                stack: ['react', 'redux', 'sass'],
                link: 'https://sarawan.ru/',
            },
            {
                name: 'Portfolio',
                slug: 'lyaman',
                stack: ['nuxt', 'vue', 'sass', 'axios'],
                link: 'https://lyaman-askerova.kz/',
            },
            {
                name: 'AV-Dachboard',
                slug: 'dachboard',
                stack: ['nuxt', 'vue', 'sass', 'nodejs', 'sequelize', 'mysql'],
                link: 'https://dashboard.askarov.dev/',
            },
            {
                name: 'Topogeo',
                slug: 'topogeo',
                stack: ['html', 'css', 'js'],
                link: 'https://zionell.github.io/Topogeo/',
            },
            {
                name: 'Online-shop The Brand',
                slug: 'the-brand',
                stack: ['html', 'css', 'js'],
                link: 'https://zionell.github.io/The-brand/',
            },
            {
                name: 'Rendered',
                slug: 'rendered',
                stack: ['html', 'css'],
                link: 'https://zionell.github.io/rendered/',
            },
            {
                name: 'MoGo',
                slug: 'mogo',
                stack: ['html', 'css', 'js'],
                link: 'https://zionell.github.io/mogo/',
            },
            {
                name: 'LiveSimply',
                slug: 'livesimply',
                stack: ['nextjs', 'ts', 'tailwindcss'],
                link: 'https://live-simply.vercel.app/',
            },
        ]
    }),
})

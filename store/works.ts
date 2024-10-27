import {defineStore} from "pinia";
import type {IWorkCard} from "~/assets/interfaces/interface";

type WorksType = {
    works: IWorkCard[]
}

export const useWorksStore = defineStore('works', {
    state: (): WorksType => ({
        works: [
            {
                name: 'Sarawan',
                slug: 'sarawan',
                stack: ['react', 'redux', 'sass'],
                isArchived: true
            },
            {
                name: 'LiveSimply',
                slug: 'livesimply',
                stack: ['nextjs', 'ts', 'tailwindcss', 'prisma'],
                link: 'https://livesimply.site/auth/login?mode=preview',
                isDeveloping: true
            },
            {
                name: 'Nomad backpacker',
                slug: 'nomad',
                stack: ['nuxt', 'nestjs', 'ts', 'tailwindcss', 'prisma'],
                link: 'https://nomad-backpacker.com/',
                isDeveloping: true
            },
            {
                name: 'Спортивный клуб',
                slug: 'skshag',
                stack: ['nuxt', 'vue', 'sass'],
                link: 'https://skshag.ru/',
                isDeveloping: true
            },
            // {
            //     name: 'Tourmetria',
            //     slug: 'tourmetria',
            //     stack: ['nuxt', 'vue', 'sass'],
            //     link: 'https://tourmetria:tourmetria_secret_1@tourmetria.tsacloud.com/',
            //     isDeveloping: true
            // },
            // {
            //     name: 'Portfolio',
            //     slug: 'lyaman',
            //     stack: ['nuxt', 'vue', 'sass', 'axios', 'strapi'],
            //     link: 'https://lyaman-askerova.kz/',
            //     isDeveloping: true
            // },
            // {
            //     name: 'AV-Dachboard',
            //     slug: 'dachboard',
            //     stack: ['nuxt', 'vue', 'sass', 'nodejs', 'sequelize', 'mysql'],
            //     link: 'https://dashboard.askarov.dev/',
            //     isDeveloping: true
            // },
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
        ]
    }),
})

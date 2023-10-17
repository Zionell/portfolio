import {defineStore} from "pinia";
import {IWorkCard} from "~/assets/interfaces/interface";

export const useWorksStore = defineStore('works', {
    state: (): IWorkCard[] => {
        return [
            {
                name: 'Sarawan',
                imageSrc: '/images/projects/sarawan.jpg',
                stack: ['react', 'redux', 'sass'],
                link: 'https://sarawan.ru/',
            },
            {
                name: 'Portfolio',
                imageSrc: '/images/projects/lyaman-portfolio.png',
                stack: ['nuxt', 'vue', 'sass', 'axios'],
                link: 'https://lyaman-askerova.kz/',
            },
            {
                name: 'AV-Dachboard',
                imageSrc: '/images/projects/dachboard.jpg',
                stack: ['nuxt', 'vue', 'sass', 'nodejs', 'sequelize', 'mysql'],
                link: 'https://dachboard.askarov.dev/',
            },
            {
                name: 'Topogeo',
                imageSrc: '/images/projects/topogeo.jpg',
                stack: ['html', 'css', 'js'],
                link: 'https://zionell.github.io/Topogeo/',
            },
            {
                name: 'Online-shop The Brand',
                imageSrc: '/images/projects/theBrand.jpg',
                stack: ['html', 'css', 'js'],
                link: 'https://zionell.github.io/The-brand/',
            },
            {
                name: 'Rendered',
                imageSrc: '/images/projects/rendered.png',
                stack: ['html', 'css'],
                link: 'https://zionell.github.io/rendered/',
            },
            {
                name: 'MoGo',
                imageSrc: '/images/projects/mogo.png',
                stack: ['html', 'css', 'js'],
                link: 'https://zionell.github.io/mogo/',
            },
        ]
    },
})

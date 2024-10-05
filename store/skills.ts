import {defineStore} from "pinia";
import type {ISkills} from "~/assets/interfaces/interface";

export const useSkillsStore = defineStore('skills', {
    state: (): ISkills[] => {
        return [{
            title: 'The skills, tools I use:',
            items: [{
                icon: 'html',
                label: 'HTML'
            }, {
                icon: 'css',
                label: 'CSS'
            }, {
                icon: 'sass',
                label: 'SASS'
            }, {
                icon: 'js',
                label: 'JavaScript'
            }, {
                icon: 'vue',
                label: 'Vue'
            }, {
                icon: 'nuxt',
                label: 'Nuxt.js'
            }, {
                icon: 'react',
                label: 'React'
            }, {
                icon: 'nextjs',
                label: 'Next.js'
            },{
                icon: 'nestjs',
                label: 'NestJS'
            }, {
                icon: 'ts',
                label: 'TypeScript'
            }, {
                icon: 'nodejs',
                label: 'Node.js'
            }, {
                icon: 'express',
                label: 'Express'
            }, {
                icon: 'pinia',
                label: 'Pinia'
            },{
                icon: 'redux',
                label: 'Redux'
            }, {
                icon: 'tailwindcss',
                label: 'Tailwind CSS'
            }, {
                icon: 'vuetifyjs',
                label: 'Vuetify'
            },{
                icon: 'zod',
                label: 'Zod'
            },{
                icon: 'axios',
                label: 'Axios'
            }, {
                icon: 'figma',
                label: 'Figma'
            }, {
                icon: 'git',
                label: 'Git'
            }, {
                icon: 'githubIcon',
                label: 'GitHub'
            }, {
                icon: 'mapbox',
                label: 'Mapbox'
            }, {
                icon: 'gulp',
                label: 'Gulp'
            }, {
                icon: 'postman',
                label: 'Postman'
            }, {
                icon: 'jwt',
                label: 'JWT tokens'
            }, {
                icon: 'sequelize',
                label: 'Sequalize'
            }, {
                icon: 'strapi',
                label: 'Strapi'
            }, {
                icon: 'mongo',
                label: 'MongoDB'
            }, {
                icon: 'mysql',
                label: 'MySQL'
            }, {
                icon: 'postgresql',
                label: 'Postgresql'
            }, {
                icon: 'prisma',
                label: 'Prisma'
            },{
                icon: 'docker',
                label: 'Docker'
            },{
                icon: 'chartjs',
                label: 'Chart.js'
            },{
                icon: 'eslint',
                label: 'Eslint'
            },{
                icon: 'greensock',
                label: 'GSAP'
            },{
                icon: 'jest',
                label: 'Jest'
            },{
                icon: 'leaflet',
                label: 'Leaflet'
            },{
                icon: 'supabase',
                label: 'Supabase'
            },{
                icon: 'swagger',
                label: 'Swagger'
            },{
                icon: 'firebase',
                label: 'Firebase'
            }]
        }]
    },
})

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
                icon: 'nodejs',
                label: 'Node.js'
            }, {
                icon: 'vue',
                label: 'Vue'
            }, {
                icon: 'nuxt',
                label: 'Nuxt.js'
            }, {
                icon: 'nextjs',
                label: 'Next.js'
            }, {
                icon: 'ts',
                label: 'TypeScript'
            }, {
                icon: 'express',
                label: 'Express'
            }, {
                icon: 'react',
                label: 'React'
            }, {
                icon: 'redux',
                label: 'Redux'
            }, {
                icon: 'tailwindcss',
                label: 'Tailwind CSS'
            }, {
                icon: 'axios',
                label: 'Axios'
            }, {
                icon: 'figma',
                label: 'Figma'
            }, {
                icon: 'git',
                label: 'Gir'
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
                icon: 'mongo',
                label: 'MongoDB'
            }, {
                icon: 'mysql',
                label: 'MySQL'
            }]
        }]
    },
})

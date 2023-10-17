import {defineStore} from "pinia";
import {IMenuItem} from "~/assets/interfaces/interface";

export const useMenuStore = defineStore('menu', {
    state: (): IMenuItem[] => {
        return [
            {
                label: 'About',
                value: 'about',
            },
            {
                label: 'Skills & Tools',
                value: 'skills',
            },
            {
                label: 'Projects',
                value: 'works',
            },
            {
                label: 'Contacts',
                value: 'contacts',
            },
            // {
            //   label: 'Примеры кода',
            //   value: '/code',
            // },
        ]
    },
})

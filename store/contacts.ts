import {defineStore} from "pinia";
import {IContact} from "~/assets/interfaces/interface";

export const useContactsStore = defineStore('contacts', {
    state: (): IContact[] => {
        return [
            {
                name: 'GitHub',
                icon: 'github',
                link: 'https://github.com/Zionell',
            },
            {
                name: 'Instagram',
                icon: 'instagram',
                link: 'https://www.instagram.com/adilhan96/',
            },
            {
                name: 'Telegram',
                icon: 'telegram',
                link: 'https://t.me/Adilhan96',
            },
            {
                name: 'VKontakte',
                icon: 'vk',
                link: 'https://vk.com/id142718327',
            },
            {
                name: 'WhatsApp',
                icon: 'whatsapp',
                link: 'https://wa.me/79649346295',
            },
        ]
    },
})

import {defineStore} from "pinia";
import {NullOrBool} from "~/assets/types";
import {IObject} from "~/assets/interfaces/interface";

export const useDeviceStore = defineStore('device', {
    state: () => {
        return {
            webpSupported: null as null | boolean,
            isIos: null as null | boolean,
            isOsx: null as null | boolean,
            isTouch: null as null | boolean,
            isSafari: null as null | boolean,
            acceptFormats: '',
            yaMetricsObserverState: null as null | boolean,
        }
    },
    getters: {
        getIsWebpSupported: (state): NullOrBool => state.webpSupported,
        getIsIos: (state): NullOrBool => state.isIos,
        getIsOsx: (state): NullOrBool => state.isOsx,
        getIsSafari: (state): NullOrBool => state.isSafari,
        getIsIpadPro: (state): NullOrBool => state.isTouch && state.isOsx && !state.isIos,

    },
    actions: {
        async init(headers: IObject) {
            const accept = headers['accept'];
            const userAgent = headers['user-agent'];

            if (accept) {
                this.changeAcceptFormats(accept.split('/'))
                this.changeIsWebpSupported(/\b(webp)\b/i.test(accept))
            }

            if (userAgent) {
                this.changeIsIos(/(iPhone|iPad)/i.test(userAgent))
                this.changeIsOsx(/(Mac)/i.test(userAgent))
                this.changeIsSafari(/^((?!chrome|android).)*safari/i.test(userAgent))
            }
        },

        setYaMetricsObserverState(referer: string) {
            this.yaMetricsObserverState = ['https://metrika.yandex.ru/', 'https://metrica.yandex.com/'].includes(referer)
        },

        changeIsTouch(payload: NullOrBool): void {
            this.isTouch = payload;
        },

        changeIsOsx(payload: NullOrBool): void {
            this.isOsx = payload;
        },

        changeIsIos(payload: NullOrBool): void {
            this.isIos = payload;
        },

        changeIsSafari(payload: NullOrBool): void {
            this.isSafari = payload;
        },

        changeAcceptFormats(payload: string): void {
            this.acceptFormats = payload;
        },

        changeIsWebpSupported(payload: NullOrBool): void {
            this.webpSupported = payload;
        },
    },
})

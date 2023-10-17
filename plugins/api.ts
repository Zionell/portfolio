import {apiConfig} from "~/config/apiConfig";
import {defineNuxtPlugin} from "nuxt/app";
import {IApiConfig} from "~/assets/interfaces/apiInterface";

interface IProvide {
    provide: {
        api: IApiConfig
    }
}

export default defineNuxtPlugin((): IProvide => {
    return {
        provide: {
            api: apiConfig
        }
    }
})

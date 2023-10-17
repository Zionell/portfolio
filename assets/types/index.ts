import {Swiper as SwiperTypeInstance} from 'swiper'
import {ILazyLoadInstance} from "vanilla-lazyload";
import {IApiConfig} from "~/assets/interfaces/apiInterface";

export type StrOrNum = string | number;

export type NullOrBool = null | boolean;

export type SwiperType = SwiperTypeInstance;

export type MediaSlideLazyType = ILazyLoadInstance | null

interface PluginsInjections {
    $api: IApiConfig
}

declare module 'nuxt/dist/app/nuxt' {
    interface NuxtApp extends PluginsInjections {}
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties extends PluginsInjections {}
}

export type HtmlType = HTMLElement | null

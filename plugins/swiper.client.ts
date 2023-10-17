import {defineNuxtPlugin} from "nuxt/app";
import SwiperCore from 'swiper';
import {Controller, Navigation} from "swiper/modules";
import 'swiper/swiper-bundle.css';

export default defineNuxtPlugin(() => {
    SwiperCore.use([Navigation, Controller]);

    return {
        provide: {
            Swiper: SwiperCore
        }
    }
})

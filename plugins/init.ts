import {defineNuxtPlugin, useRequestHeaders} from "nuxt/app";
import {useDomainStore} from "~/store/domain";
import {useDeviceStore} from "~/store/device";
// import {useWorksStore} from "~/store/works";
// import {getImage} from "~/assets/js/puppeter";

export default defineNuxtPlugin(async (nuxtApp): Promise<void> => {
    try {
        const headers = useRequestHeaders();
        const domainStore = useDomainStore()
        const deviceStore = useDeviceStore()
        await Promise.all([
            domainStore.init(headers),
            deviceStore.init(headers),
        ]);

        // const {works} = useWorksStore()
        // works.forEach(w =>{
        //     getImage(w.link, w.slug)
        // })
    } catch (e) {
        console.warn(e)
    }
});

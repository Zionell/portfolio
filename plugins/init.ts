import {defineNuxtPlugin, useRequestHeaders} from "nuxt/app";
import {useDomainStore} from "~/store/domain";
import {useDeviceStore} from "~/store/device";
import {runCron} from "assets/js/shedule";

export default defineNuxtPlugin(async (nuxtApp): Promise<void> => {
    try {
        const headers = useRequestHeaders();
        const domainStore = useDomainStore()
        const deviceStore = useDeviceStore()
        await Promise.all([
            domainStore.init(headers),
            deviceStore.init(headers),
        ]);
        runCron()
    } catch (e) {
        console.warn(e)
    }
});

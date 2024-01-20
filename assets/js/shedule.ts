import {useWorksStore} from "~/store/works";
import {IWorkCard} from "assets/interfaces/interface";
import {getImage} from "assets/js/puppeter";

const cron = require('node-cron')

let isRun = false
const runScript = () => {
    if (isRun) return
    isRun = true

    const worksStore = useWorksStore()

    worksStore.works.forEach(async (work: IWorkCard) => {
        await getImage(work.link, work.slug);
    })
};

export const runCron = (): void => {
    cron.schedule('0 0 0 * * *', () => {
        runScript();
    }, {
        timezone: 'Europe/Moscow'
    });
}
import { joinURL } from 'ufo';
import {IContext, IUrl, IOptions, IModifiers} from "~/assets/interfaces/imageInterface";

export function getImage(src: string, { modifiers, baseURL }: IOptions = {}, { options, nuxtContext, $img }: IContext = {}): IUrl {
    const { width, height, format, fit, ...providerModifiers }: IModifiers = modifiers || {};
    const operations: string[] = [];
    // process modifiers
    const operationsString = operations.join(',');
    return {
        url: joinURL(baseURL || '', operationsString, src),  // Added a fallback for baseURL
    };
}

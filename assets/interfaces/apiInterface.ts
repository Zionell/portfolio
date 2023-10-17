import {StrOrNum} from '~/assets/types'

export interface IMainPage {
    mainPage: string
}

export interface ISocials {
    messengers: string
}

export interface ISocialsApi {
    socials: ISocials
}

export interface ITours {
    list: (a?: StrOrNum, b?: StrOrNum) => string,
    detail: (id: StrOrNum) => string,
    facets: string,
    specs: string,
}

export interface IToursApi {
    tours: ITours
}

export interface IApiConfig {
    mainPage?: string,
}

export interface IEnv {
    SERVER_API: string
    DEVELOPMENT: boolean
}

export interface IMenuItem {
    value: string
    label: string
}

export interface IContact {
    name: string
    icon: string
    link: string
}

export interface IParagraph {
    value: string
}

export interface ISkill {
    icon: string
    label: string
}

export interface ISkills {
    title: string
    items: ISkill[]
}

export interface IObject {
    [key: string]: any
}

export interface ISliderSwipe {
    isBeginning: boolean
    isEnd: boolean
}

export interface IPreviewImg {
    width: number | undefined
    height: number | undefined
    quality: number | undefined
    blur: number | undefined
}

export interface ISlidesImages {
    images: string[]
    imagesPreview: string[]
}

export interface ITag {
    label: string
    icon: string
}

export interface IWorkCard {
    link: string
    name: string
    stack: string[]
    slug: string
    isDeveloping?: boolean
    isArchived?: boolean
}

export interface IExperience {
    company: string
    position: string
    period: string
    tasks: string
    achievements: string
    stack: string
}

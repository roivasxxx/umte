export type Dictionary = {
    [key: string]: string | number | boolean
}

export interface Info {
    wishInfo: WishInfo
    accountId: string
}
export interface WishInfo {
    standard: BannerInfo
    character: BannerInfo
    weapon: BannerInfo
}
export interface BannerInfo {
    pullCount: number
    last4Star: string | null
    last5Star: string | null
    pity4Star: number
    pity5Star: number
    lastId: string | null
}

export interface Wish {
    id: string
    date: string
    rarity: number
    hoyoId: string
    pity: number
    bannerType: string
    wishNumber: number
    item: Item
}
export interface Item {
    icon: Icon
    value: string
}
export interface Icon {
    alt: string
    url: string
    originalName: string
}

export interface GenshinWish {
    id: string
    bannerType?: ("character" | "weapon" | "standard") | null
    date?: string | null
    pity?: number | null
    hoyoId?: string | null
    banner?: string | null
    genshinAccount?: string | null
    itemId?: string | null
    wishId?: string | null
    updatedAt: string
    createdAt: string
}

export type RequestUtilsBody =
    | {
          body: object
          method: "POST" | "PATCH" | "PUT"
          params?: undefined | null
      }
    | {
          body?: undefined | null
          method: "GET" | "DELETE"
          params?: Dictionary
      }

export enum BANNER_TYPE {
    CHARACTER = "character",
    WEAPON = "weapon",
    STANDARD = "standard",
}

export type NotificationItemType = {
    name: string
    id: string
    icon?: string
    days: string[]
}

export enum ACCOUNT_REGIONS {
    "os_euro" = "Europe",
    "os_asia" = "Asia",
    "os_usa" = "America",
    "os_cht" = "China",
}

export type GenshinCharacter = {
    id: string
    name: string
    icon: string
    substat: string
    weaponType: string
    rarity: number
    element: {
        name: string
        icon: string
    }
    specialty: {
        name: string
        icon: string
    }
    talent: {
        name: string
        icon: string
    }
    trounce: {
        name: string
        icon: string
    }
    boss: {
        name: string
        icon: string
    }
    books: {
        name: string
        icon: string
    }
}

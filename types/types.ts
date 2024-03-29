export type WishInfo = {
    standard: {
        pullCount: number
        last4Star?: (string | null) | GenshinWish
        last5Star?: (string | null) | GenshinWish
        pity4Star: number
        pity5Star: number
        lastId?: string | null
    }
    weapon: {
        pullCount: number
        last4Star?: (string | null) | GenshinWish
        last5Star?: (string | null) | GenshinWish
        pity4Star: number
        pity5Star: number
        lastId?: string | null
    }
    character: {
        pullCount: number
        last4Star?: (string | null) | GenshinWish
        last5Star?: (string | null) | GenshinWish
        pity4Star: number
        pity5Star: number
        lastId?: string | null
    }
    lastUpdate?: string | null
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
      }
    | {
          body?: undefined | null
          method: "GET" | "DELETE"
      }

export enum BANNER_TYPE {
    CHARACTER = "character",
    WEAPON = "weapon",
    STANDARD = "standard",
}

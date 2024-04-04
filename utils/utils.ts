export const timer = (time: number) =>
    new Promise((res, reject) => {
        setTimeout(() => {
            res("ok")
        }, time)
    })

export const createDeepCopy = (obj: object) => JSON.parse(JSON.stringify(obj))

export const capitalizeString = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1)

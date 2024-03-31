export const timer = (time: number) =>
    new Promise((res, reject) => {
        setTimeout(() => {
            res("ok")
        }, time)
    })

export const createDeepCopy = (obj: object) => JSON.parse(JSON.stringify(obj))

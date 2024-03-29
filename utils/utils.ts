export const timer = () =>
    new Promise((res, reject) => {
        setTimeout(() => {
            res("ok")
        }, 5000)
    })

export const createDeepCopy = (obj: object) => JSON.parse(JSON.stringify(obj))

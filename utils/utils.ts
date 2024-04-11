/**
 * Helper function to simulate requests
 */
export const timer = (time: number) =>
    new Promise((res, reject) => {
        setTimeout(() => {
            res("ok")
        }, time)
    })

/**
 * Helper function to create a deep copy
 */
export const createDeepCopy = (obj: object) => JSON.parse(JSON.stringify(obj))

/**
 * Helper function to capitalize a string
 * this is a string -> This Is A String
 */
export const capitalizeString = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1)

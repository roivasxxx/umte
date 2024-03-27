export const timer = () =>
    new Promise((res, reject) => {
        setTimeout(() => {
            res('ok')
        }, 5000)
    })

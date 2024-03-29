import { RequestUtilsBody } from "@/types/types"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import * as SecureStore from "expo-secure-store"

export default async function cmsRequest(
    params: {
        path: string
        abortController?: AbortController
        headers?: Record<string, string>
    } & RequestUtilsBody
) {
    const { path, abortController, body, headers } = params

    const _path =
        process.env.EXPO_PUBLIC_BACKEND_URL +
        (path[0] === "/" ? path : "/" + path)

    const fetchOptions: AxiosRequestConfig = {
        method: params.method,
        withCredentials: true,
        headers: {},
        url: _path,
    }

    const token = SecureStore.getItem("payload-token")
    if (token && fetchOptions.headers) {
        fetchOptions.headers.Authorization = `Bearer ${token}`
    }

    if (body && fetchOptions.headers) {
        fetchOptions.data = body
        fetchOptions.headers["Content-Type"] = "application/json"
    }
    if (abortController) {
        fetchOptions.signal = abortController.signal
    }
    if (headers) {
        fetchOptions.headers = { ...fetchOptions.headers, ...params.headers }
    }

    return await axios(fetchOptions)
}

const wrapPromise = (promise: Promise<AxiosResponse<any, any>>) => {
    let status = "pending"
    let result: AxiosResponse<any, any> | null = null
    let suspender = promise.then(
        (r) => {
            status = "success"
            result = r
        },
        (e) => {
            status = "error"
            result = e
        }
    )
    return {
        read() {
            if (status === "pending") {
                throw suspender
            } else if (status === "error") {
                throw result
            }
            return result
        },
    }
}

export const createResource = (request: Promise<AxiosResponse<any, any>>) => {
    return wrapPromise(request)
}

export type ResourceType = ReturnType<typeof createResource>

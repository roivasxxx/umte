import { RequestUtilsBody } from "@/types/types"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import * as SecureStore from "expo-secure-store"
import * as FileSystem from "expo-file-system"
import { shareAsync } from "expo-sharing"
import Constants from "expo-constants"

// local backend
const BE_URL = process.env.EXPO_PUBLIC_BACKEND_URL
    ? process.env.EXPO_PUBLIC_BACKEND_URL
    : Constants?.expoConfig?.extra?.eas.BE_URL

/**
 * Handles making requests to the backend
 */
export default async function cmsRequest(
    fetchParams: {
        path: string
        abortController?: AbortController
        headers?: Record<string, string>
    } & RequestUtilsBody
) {
    const { path, abortController, body, headers, method, params } = fetchParams

    const url = new URL(BE_URL + (path[0] === "/" ? path : "/" + path))

    if (method === "GET" && params) {
        Object.keys(params).forEach((key) => {
            url.searchParams.append(key, String(params[key]))
        })
    }

    const fetchOptions: AxiosRequestConfig = {
        method,
        withCredentials: true,
        headers: {},
        url: url.href,
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
        fetchOptions.headers = {
            ...fetchOptions.headers,
            ...fetchParams.headers,
        }
    }

    return await axios(fetchOptions)
}

/**
 * Wrapping promises for the React.Suspense component
 */
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

/**
 * Used to make requests to the backend when using React.Suspense
 */
export const createResource = (request: Promise<AxiosResponse<any, any>>) => {
    return wrapPromise(request)
}

export type ResourceType = ReturnType<typeof createResource>

/**
 * Handles downloading a file
 */
export const downloadFile = async (
    url: string,
    filename: string,
    callback?: () => void
) => {
    const token = SecureStore.getItem("payload-token")

    const _url = new URL(BE_URL + (url[0] === "/" ? url : "/" + url))

    const downloadResumable = FileSystem.createDownloadResumable(
        _url.href,
        FileSystem.documentDirectory + filename,
        { headers: { Authorization: `Bearer ${token}` } },
        callback
    )
    const download = await downloadResumable.downloadAsync()
    if (download) {
        await shareAsync(download.uri)
    }
}

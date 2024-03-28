import React, { useEffect, useState } from "react"
import * as SecureStore from "expo-secure-store"
import cmsRequest from "@/utils/fetchUtils"
import { router } from "expo-router"
import { AxiosError, isAxiosError } from "axios"

export type User = {
    email: string
}

const AuthContext = React.createContext<{
    signIn: (email: string, password: string) => Promise<void> | null
    signOut: () => Promise<void> | null
    signUp: (
        email: string,
        password: string,
        setError: (e: string) => void
    ) => Promise<void> | null
    session: User | null
    loading: boolean
}>({
    signIn: () => null,
    signOut: () => null,
    signUp: () => null,
    session: null,
    loading: true,
})

// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext)
    if (process.env.NODE_ENV !== "production") {
        if (!value) {
            throw new Error(
                "useSession must be wrapped in a <SessionProvider />"
            )
        }
    }

    return value
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [session, setSession] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getToken = async () => {
            // check if token exists
            const token = SecureStore.getItem("payload-token")
            if (token) {
                try {
                    const res = await cmsRequest({
                        path: "api/public-users/refresh-token",
                        method: "POST",
                        body: {},
                    })
                    const data = res.data
                    if (data.refreshedToken && data.user && data.user.email) {
                        // if the current token is valid, a new token will be returned by the api
                        // save this new token and change the email - !! no need to actually change the email, change other props if necessary
                        SecureStore.setItem(
                            "payload-token",
                            data.refreshedToken
                        )
                        setSession({ email: data.user.email })
                    } else {
                        // if the current token is invalid, throw error
                        // this error will be caught and the user will be signed out and redirected to the login page
                        throw new Error("ME_ERROR")
                    }
                    // redirect to home if token is valid
                    router.replace("/home")
                } catch (error) {
                    console.error("Error while fetching user", error)
                    SecureStore.setItem("payload-token", "")
                    setSession(null)
                    router.replace("/")
                }
            }
            setLoading(false)
        }
        getToken()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                signIn: async (email: string, password: string) => {
                    try {
                        setLoading(true)
                        const res = await cmsRequest({
                            path: "api/public-users/login",
                            method: "POST",
                            body: {
                                email: email,
                                password: password,
                            },
                        })
                        const data = res.data
                        if (data.token && data.user && data.user.email) {
                            // store token and user email
                            SecureStore.setItem("payload-token", data.token)
                            setSession({ email: data.user.email })
                            router.replace("/home")
                        }
                    } catch (e) {
                        console.error("Error during login", e)
                    }
                    setLoading(false)
                },
                signOut: async () => {
                    try {
                        await cmsRequest({
                            path: "api/public-users/logout",
                            method: "POST",
                            body: {},
                        })
                    } catch (error) {
                        console.error("Error during logout", error)
                    }
                    setSession(null)
                    SecureStore.setItem("payload-token", "")
                },
                signUp: async (
                    email: string,
                    password: string,
                    setError: (e: string) => void
                ) => {
                    try {
                        const regRes = await cmsRequest({
                            path: "api/public-users/register",
                            method: "POST",
                            body: { email, password },
                        })
                        console.log(regRes.data)
                        const data = regRes.data
                        if (data.token && data.user && data.user.email) {
                            // store token and user email
                            SecureStore.setItem("payload-token", data.token)
                            setSession({ email: data.user.email })
                            router.replace("/home")
                        }
                    } catch (error) {
                        if (isAxiosError(error)) {
                            const e = error as AxiosError
                            if (e.response?.status === 400) {
                                setError("Email already in use")
                            } else {
                                setError("Something went wrong")
                            }
                        }
                        console.error("Error during registration", error)
                    }
                },
                loading,
                session,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

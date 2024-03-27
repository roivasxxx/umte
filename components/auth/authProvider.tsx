import React, { useEffect, useState } from "react"
import * as SecureStore from "expo-secure-store"
import cmsRequest from "@/utils/fetchUtils"
import { router } from "expo-router"

export type User = {
    email: string
}

const AuthContext = React.createContext<{
    signIn: (email: string, password: string) => void
    signOut: () => void
    session: User | null
    loading: boolean
}>({
    signIn: async () => null,
    signOut: async () => null,
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
    //   const [[isLoading, session], setSession] = useStorageState('session');
    const [session, setSession] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getToken = async () => {
            const token = SecureStore.getItem("payload-token")
            if (token) {
                try {
                    const res = await cmsRequest({
                        path: "api/public-users/me",
                        method: "GET",
                    })
                    const data = res.data
                    if (data.token && data.user && data.user.email) {
                        // store this data only
                        SecureStore.setItem("payload-token", data.token)
                        setSession({ email: data.user.email })
                    } else {
                        throw new Error("ME_ERROR")
                    }
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
                            // store this data only
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
                loading,
                session,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

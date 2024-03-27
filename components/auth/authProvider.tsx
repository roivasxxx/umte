import React, { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { timer } from '@/utils/utils'

const AuthContext = React.createContext<{
    signIn: () => void
    signOut: () => void
    session: { email: string; name: string } | null
    loading: boolean
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    loading: true,
})

// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext)
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error(
                'useSession must be wrapped in a <SessionProvider />'
            )
        }
    }

    return value
}

export function SessionProvider(props: React.PropsWithChildren) {
    //   const [[isLoading, session], setSession] = useStorageState('session');
    const [session, setSession] = useState<{
        email: string
        name: string
    } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getToken = async () => {
            const token = SecureStore.getItem('payload-token')
            if (token) {
                // setSession({})
            }
            setLoading(false)
        }
        getToken()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                signIn: () => {
                    setSession({
                        email: 'uH4kL@example.com',
                        name: 'test',
                    })
                    // Perform sign-in logic here
                    //   setSession('xxx');
                },
                signOut: () => {
                    setSession(null)
                },
                loading,
                session,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

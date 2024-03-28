import { useSession } from "@/components/auth/authProvider"
import { Redirect, Stack } from "expo-router"

export default function AppLayout() {
    const { session } = useSession()

    if (!session) {
        return <Redirect href="/" />
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="home" options={{ headerShown: false }} />
            </Stack>
        </>
    )
}

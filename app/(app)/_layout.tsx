import { useSession } from '@/components/auth/authProvider'
import { Redirect, Stack } from 'expo-router'
import { Text, View } from 'react-native'

export default function AppLayout() {
    const { session } = useSession()

    if (!session) {
        return <Redirect href="/" />
    }

    return (
        <Stack>
            <Stack.Screen name="home" options={{ headerShown: false }} />
        </Stack>
    )
}

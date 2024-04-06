import AccountProvider from "@/components/account/accountProvider"
import { Colors } from "@/constants/Colors"
import { Stack } from "expo-router"

export default function AccountLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: Colors.background,
                },
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="[id]"
                getId={({ params }) => params?.id}
                options={{ headerShown: false }}
            />
        </Stack>
    )
}

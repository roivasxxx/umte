import { Colors } from "@/constants/Colors"
import { Stack } from "expo-router"

export default function DatabaseLayout() {
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
        </Stack>
    )
}

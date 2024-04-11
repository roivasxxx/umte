import { SessionProvider } from "@/components/auth/authProvider"
import { Colors } from "@/constants/Colors"
import { Slot } from "expo-router"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

/**
 * Root layout
 */
export default function Root() {
    return (
        <View
            style={{
                backgroundColor: Colors.background,
                width: "100%",
                height: "100%",
            }}
        >
            <SessionProvider>
                <SafeAreaView style={{ backgroundColor: Colors.background }} />
                <Slot />
            </SessionProvider>
        </View>
    )
}

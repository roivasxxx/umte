import { SessionProvider } from "@/components/auth/authProvider"
import { Colors } from "@/constants/Colors"
import { Slot } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Root() {
    return (
        <SessionProvider>
            <SafeAreaView style={{ backgroundColor: Colors.background }} />
            <Slot />
        </SessionProvider>
    )
}

import { useSession } from "@/components/auth/authProvider"
import { Button, Text, View } from "react-native"

export default function Home() {
    const { signOut } = useSession()
    console.log("rendered home")
    return (
        <View style={{ width: "100%", height: "100%" }}>
            <Text>Hello i am logged in right now!</Text>
            <Button title="Sign out" onPress={signOut} />
        </View>
    )
}

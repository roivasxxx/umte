import { useSession } from "@/components/auth/authProvider"
import { Button, Text, View } from "react-native"

export default function Home() {
    const { signOut } = useSession()
    return (
        <View>
            <Text>Hello i am logged in right now!</Text>
            <Button title="Sign out" onPress={signOut} />
        </View>
    )
}

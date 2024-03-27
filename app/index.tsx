import { useSession } from "@/components/auth/authProvider"
import React from "react"
import { ActivityIndicator, Button, Text, TextInput, View } from "react-native"

export default function App() {
    const { signIn, loading } = useSession()
    if (loading) {
        return (
            <View>
                <ActivityIndicator />
            </View>
        )
    }
    const [userState, setUserState] = React.useState({
        email: "",
        password: "",
    })

    return (
        <View>
            <Text>Hello expo!</Text>
            <TextInput
                value={userState.email}
                onChangeText={(e) => setUserState({ ...userState, email: e })}
                placeholder="Email"
            />
            <TextInput
                value={userState.password}
                onChangeText={(e) =>
                    setUserState({ ...userState, password: e })
                }
                placeholder="Password"
            />
            <Button
                title="Login"
                onPress={() => {
                    signIn(userState.email, userState.password)
                }}
            ></Button>
        </View>
    )
}

import { useSession } from "@/components/auth/authProvider"
import LoginForm from "@/components/auth/loginForm"
import { Colors } from "@/constants/Colors"
import styles from "@/constants/styles"
import React from "react"
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"

export default function Register() {
    const { signUp, loading } = useSession()
    const [userState, setUserState] = React.useState({
        email: "test@test.cz",
        password: "password",
        error: null,
    })

    const setError = (e: any) => {
        setUserState({ ...userState, error: e })
    }

    if (loading) {
        return (
            <View>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <View
            style={[
                {
                    width: "100%",
                    height: "100%",
                    backgroundColor: Colors.background,
                },
                styles.FLEX_CENTERED_COLUMN,
            ]}
        >
            <View
                style={{
                    flexDirection: "column",
                    width: "80%",
                }}
            >
                <LoginForm buttonText="Sign up" />
            </View>
        </View>
    )
}

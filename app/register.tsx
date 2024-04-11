import { useSession } from "@/components/auth/authProvider"
import LoginForm from "@/components/auth/loginForm"
import { Colors } from "@/constants/Colors"
import styles from "@/constants/styles"
import React from "react"
import { ActivityIndicator, View } from "react-native"

/**
 * Register screen
 */
export default function Register() {
    const { loading } = useSession()

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

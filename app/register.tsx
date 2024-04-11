import LoginForm from "@/components/auth/loginForm"
import { Colors } from "@/constants/Colors"
import styles from "@/constants/styles"
import React from "react"
import { View } from "react-native"

/**
 * Register screen
 */
export default function Register() {
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

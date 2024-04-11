import LoginForm from "@/components/auth/loginForm"
import { Colors } from "@/constants/Colors"
import styles from "@/constants/styles"
import React from "react"
import { Text, View } from "react-native"
import Splash from "../assets/images/splash.svg"
import { Link } from "expo-router"

/**
 * Login screen
 */
export default function App() {
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
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 40,
                    }}
                >
                    <Splash width={100} height={100} />
                </View>
                <LoginForm buttonText="Sign in">
                    <Text
                        style={{
                            marginVertical: 10,
                            color: Colors.text,
                            textAlign: "center",
                        }}
                    >
                        No account?{" "}
                        <Link href="/register" style={{ color: Colors.button }}>
                            Sign up
                        </Link>
                    </Text>
                    <Text
                        style={{
                            marginVertical: 10,
                            color: Colors.text,
                            textAlign: "center",
                        }}
                    >
                        <Link
                            href="/forgotten-password"
                            style={{ color: Colors.button }}
                        >
                            Forgot your password?
                        </Link>
                    </Text>
                </LoginForm>
            </View>
        </View>
    )
}

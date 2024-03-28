import { useSession } from "@/components/auth/authProvider"
import { Colors } from "@/constants/Colors"
import styles from "@/constants/styles"
import { Link } from "expo-router"
import React, { useEffect } from "react"
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Animated,
    Easing,
} from "react-native"
import Splash from "../assets/images/splash.svg"

export default function App() {
    const { signIn, loading } = useSession()
    const [userState, setUserState] = React.useState({
        email: "test@test.cz",
        password: "password",
    })

    const spinValue = new Animated.Value(0)
    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "-360deg"],
    })

    const spin = () => {
        spinValue.setValue(0)
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 50000,
                useNativeDriver: true,
                easing: Easing.linear,
            })
        ).start()
    }

    useEffect(() => {
        spin()
    }, [])

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
                <Animated.View
                    style={[
                        {
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 40,
                        },
                        { transform: [{ rotate: rotate }] },
                    ]}
                >
                    <Splash width={200} height={200} />
                </Animated.View>
                <TextInput
                    value={userState.email}
                    onChangeText={(e) =>
                        setUserState({ ...userState, email: e })
                    }
                    placeholder="Email"
                    style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: Colors.content,
                        color: Colors.text,
                        borderRadius: 5,
                        borderColor: Colors.border,
                        borderWidth: 2,
                        marginBottom: 10,
                    }}
                    placeholderTextColor={Colors.text}
                />
                <TextInput
                    value={userState.password}
                    onChangeText={(e) =>
                        setUserState({ ...userState, password: e })
                    }
                    placeholder="Password"
                    style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: Colors.content,
                        color: Colors.text,
                        borderRadius: 5,
                        borderColor: Colors.border,
                        borderWidth: 2,
                        marginBottom: 10,
                    }}
                    placeholderTextColor={Colors.text}
                />
                <TouchableOpacity
                    onPress={() => {
                        signIn(userState.email, userState.password)
                    }}
                    style={{
                        padding: 15,
                        marginVertical: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: Colors.button,
                        borderRadius: 5,
                    }}
                >
                    <Text>Login</Text>
                </TouchableOpacity>
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
            </View>
        </View>
    )
}

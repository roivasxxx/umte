import { useSession } from "@/components/auth/authProvider"
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
                {userState.error ? (
                    <Text
                        style={{
                            padding: 10,
                            color: Colors.text,
                            backgroundColor: "red",
                            marginVertical: 10,
                            textAlign: "center",
                            borderRadius: 5,
                        }}
                    >
                        {userState.error}
                    </Text>
                ) : null}
                <TextInput
                    value={userState.email}
                    onChangeText={(e) =>
                        setUserState({ ...userState, email: e, error: null })
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
                        setUserState({ ...userState, password: e, error: null })
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
                        signUp(userState.email, userState.password, setError)
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
                    <Text>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

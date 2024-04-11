import { useSession } from "@/components/auth/authProvider"
import { Colors } from "@/constants/Colors"
import styles from "@/constants/styles"
import React, { useState } from "react"
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"

/**
 * Forgotten password screen
 */
export default function ForgottenPassword() {
    const { loading, forgotPassword } = useSession()
    const [userState, setUserState] = useState({
        email: "",
        status: "",
    })

    const setStatus = (status: string) => {
        setUserState({ ...userState, status })
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
                {userState.status !== "" ? (
                    <Text
                        style={{
                            backgroundColor:
                                userState.status === "SUCCESS"
                                    ? "green"
                                    : "red",
                            textAlign: "center",
                            borderRadius: 5,
                            padding: 10,
                            color: Colors.text,
                            marginVertical: 10,
                        }}
                    >
                        {userState.status === "SUCCESS"
                            ? "Email sent"
                            : "Something went wrong"}
                    </Text>
                ) : (
                    <></>
                )}
                <TextInput
                    value={userState.email}
                    onChangeText={(e) =>
                        setUserState({ ...userState, email: e, status: "" })
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
                <TouchableOpacity
                    onPress={() => {
                        forgotPassword(userState.email, setStatus)
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
                    <Text>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

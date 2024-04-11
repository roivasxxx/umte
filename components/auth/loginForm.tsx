import { ReactNode, useState } from "react"
import { useSession } from "./authProvider"
import { Text, TextInput, TouchableOpacity } from "react-native"
import { Colors } from "@/constants/Colors"
import SpinningLogo from "../spinningLogo"

/**
 * Shared component for login and signup, they differ in the button text, and some extra children provided by the children prop
 */
export default function LoginForm(props: {
    buttonText: "Sign in" | "Sign up"
    children?: ReactNode
}) {
    const { loading, signIn, signUp } = useSession()
    const [userState, setUserState] = useState({
        email: "",
        password: "",
        error: null,
    })

    const onPress = props.buttonText === "Sign in" ? signIn : signUp

    const setError = (e: any) => {
        setUserState({ ...userState, error: e })
    }

    return (
        <>
            {userState.error ? (
                <Text
                    style={{
                        backgroundColor: "red",
                        textAlign: "center",
                        borderRadius: 5,
                        padding: 10,
                        color: Colors.text,
                        marginVertical: 10,
                    }}
                >
                    {userState.error}
                </Text>
            ) : (
                <></>
            )}
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
                secureTextEntry
            />
            <TouchableOpacity
                onPress={() => {
                    onPress(userState.email, userState.password, setError)
                }}
                style={{
                    padding: 15,
                    marginVertical: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: loading ? Colors.content : Colors.button,
                    borderRadius: 5,
                }}
            >
                {loading ? (
                    <SpinningLogo width={35} height={35} />
                ) : (
                    <Text>{props.buttonText}</Text>
                )}
            </TouchableOpacity>

            {props.children}
        </>
    )
}

import { useAccount } from "@/components/account/accountProvider"
import SpinningLogo from "@/components/spinningLogo"
import { Colors } from "@/constants/Colors"
import { ACCOUNT_REGIONS } from "@/types/types"
import { router } from "expo-router"
import { useState } from "react"
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native"

/**
 * New Genshin Account screen
 */
export default function NewAccount() {
    const { createGenshinAccount } = useAccount()

    const [state, setState] = useState<{
        region: ACCOUNT_REGIONS | ""
        hoyoId: string
        loading: boolean
    }>({
        region: "",
        hoyoId: "",
        loading: false,
    })

    const createAccount = async () => {
        if (createGenshinAccount && state.region) {
            setState({ ...state, loading: true })
            const id = await createGenshinAccount({
                region: state.region,
                hoyoId: state.hoyoId,
            })
            setState({
                ...state,
                loading: false,
            })
            Alert.alert(
                id ? "Success" : "Error",
                id ? `Account ${id} created` : "Failed to create account",
                [
                    {
                        text: "OK",
                        onPress: () => router.replace("/(app)/account"),
                    },
                ]
            )
        }
    }

    return (
        <View
            style={{
                height: "100%",
                justifyContent: "space-between",
            }}
        >
            {state.loading ? (
                <SpinningLogo />
            ) : (
                <View style={{ padding: 10 }}>
                    <View>
                        <Text
                            style={{
                                color: Colors.text,
                                fontWeight: "bold",
                                fontSize: 18,
                                paddingVertical: 10,
                            }}
                        >
                            Region
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingHorizontal: 25,
                            }}
                        >
                            {Object.keys(ACCOUNT_REGIONS).map((key) => {
                                return (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor:
                                                state.region === key
                                                    ? Colors.button
                                                    : Colors.content,
                                            padding: 10,
                                            margin: 5,
                                            borderRadius: 5,
                                        }}
                                        onPress={() => {
                                            setState({
                                                ...state,
                                                region: key as ACCOUNT_REGIONS,
                                            })
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: Colors.textSecondary,
                                                minWidth: 50,
                                                textAlign: "center",
                                            }}
                                        >
                                            {
                                                ACCOUNT_REGIONS[
                                                    key as keyof typeof ACCOUNT_REGIONS
                                                ]
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <Text
                            style={{
                                color: Colors.text,
                                fontWeight: "bold",
                                fontSize: 18,
                                paddingVertical: 10,
                            }}
                        >
                            Hoyo ID
                        </Text>
                        <TextInput
                            value={state.hoyoId}
                            onChangeText={(e) =>
                                setState({ ...state, hoyoId: e })
                            }
                            placeholder="Hoyo ID"
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
                    </View>
                </View>
            )}
            <TouchableOpacity
                style={{
                    width: "100%",
                    backgroundColor: state.region
                        ? Colors.button
                        : Colors.content,
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 5,
                }}
                onPress={createAccount}
                disabled={state.loading || !state.region}
            >
                <Text
                    style={{
                        color: Colors.text,
                        fontWeight: "bold",
                        fontSize: 18,
                        paddingVertical: 5,
                        textAlign: "center",
                    }}
                >
                    Create A New Genshin Impact Account
                </Text>
            </TouchableOpacity>
        </View>
    )
}

import React, { Suspense } from "react"
import { useLocalSearchParams } from "expo-router"
import cmsRequest, { createResource } from "@/utils/fetchUtils"
import GameAccount from "@/components/account/gameAccount"
import { Image, Text, View } from "react-native"
import SpinningLogo from "@/components/spinningLogo"
import { Colors } from "@/constants/Colors"
import { GAME_ICONS } from "@/utils/imageUtils"

/**
 * Screen for specific game acount
 * This component lives inside a React.Suspense
 * It currently only supports one game -> needs to be refactored once more games are supported
 */
export default function Account() {
    const { id, game, hoyoId, region } = useLocalSearchParams()

    const resource = createResource(
        cmsRequest({
            path: `api/${game}-accounts/getAccount`,
            method: "GET",
            params: { accountId: typeof id === "string" ? id : id[0] },
        })
    )

    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                padding: 10,
            }}
        >
            <View
                style={{
                    alignItems: "center",
                }}
            >
                <Image
                    source={GAME_ICONS[game as keyof typeof GAME_ICONS]}
                    style={{
                        width: 70,
                        height: 70,
                        marginRight: 10,
                        borderRadius: 35,
                        marginVertical: 10,
                        borderWidth: 2,
                        borderColor: Colors.button,
                    }}
                />
                <Text
                    style={{
                        color: Colors.button,
                        fontWeight: "bold",
                        fontSize: 16,
                        textAlign: "center",
                    }}
                >
                    {hoyoId || id}
                </Text>
                <Text
                    style={{
                        color: Colors.text,
                        fontWeight: "bold",
                        fontSize: 14,
                        textAlign: "center",
                    }}
                >
                    {region || ""}
                </Text>
            </View>
            <Suspense
                fallback={
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <SpinningLogo />
                    </View>
                }
            >
                <GameAccount resource={resource} />
            </Suspense>
        </View>
    )
}

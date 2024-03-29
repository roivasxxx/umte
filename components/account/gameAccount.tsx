import React from "react"
import { ResourceType } from "@/utils/fetchUtils"
import { ScrollView, Text, View } from "react-native"
import { Colors } from "@/constants/Colors"
import { BANNER_TYPE, WishInfo } from "@/types/types"
import { Link } from "expo-router"

const BannerInfo = <T extends BANNER_TYPE>(props: {
    banner: T
    data: WishInfo[T]
    accountId: string
}) => {
    const banner = props.banner[0].toUpperCase() + props.banner.slice(1)

    const last4Star =
        typeof props.data.last4Star === "string" ? props.data.last4Star : "None"
    const last5Star =
        typeof props.data.last5Star === "string" ? props.data.last5Star : "None"
    const pity4Star = props.data.pity4Star || 0
    const pity5Star = props.data.pity5Star || 0
    const pullCount = props.data.pullCount || 0
    return (
        <View
            style={{
                backgroundColor: Colors.content,
                padding: 10,
                marginVertical: 10,
                borderRadius: 5,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <View>
                    <Text>{banner}</Text>
                    <Text>Last 4 star: {last4Star} </Text>
                    <Text>Pity 4 star: {pity4Star} </Text>
                    <Text>Last 5 star: {last5Star} </Text>
                    <Text>Pity 5 star: {pity5Star} </Text>
                    <Text>Pull Count: {pullCount} </Text>
                </View>
                <Link
                    href={{
                        pathname: "/(app)/account/history/[banner]",
                        params: { accountId: props.accountId, banner },
                    }}
                    style={{
                        alignItems: "center",
                        padding: 5,
                        textAlignVertical: "center",
                        color: Colors.button,
                    }}
                >
                    View History
                </Link>
            </View>
        </View>
    )
}

export default function GameAccount(props: { resource: ResourceType }) {
    const res = props.resource.read()
    const data = res?.data

    const wishInfo: WishInfo = data.wishInfo
    const accountId = data.accountId

    return (
        <ScrollView
            style={{
                padding: 10,
                marginVertical: 10,
            }}
        >
            <Text
                style={{ color: Colors.text, fontWeight: "bold", fontSize: 18 }}
            >
                Wishes
            </Text>
            <BannerInfo
                banner={BANNER_TYPE.STANDARD}
                data={wishInfo.standard}
                accountId={accountId}
            />
            <BannerInfo
                banner={BANNER_TYPE.CHARACTER}
                data={wishInfo.character}
                accountId={accountId}
            />
            <BannerInfo
                banner={BANNER_TYPE.WEAPON}
                data={wishInfo.weapon}
                accountId={accountId}
            />
        </ScrollView>
    )
}

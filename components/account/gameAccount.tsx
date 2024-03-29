import React from "react"
import { ResourceType } from "@/utils/fetchUtils"
import { ScrollView, Text, View } from "react-native"
import { Colors } from "@/constants/Colors"
import { BANNER_TYPE, WishInfo } from "@/types/types"
import { Link } from "expo-router"
import { FontAwesome } from "@expo/vector-icons"
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
                <View style={{ flex: 15 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.text,
                                fontWeight: "bold",
                                fontSize: 14,
                            }}
                        >
                            {banner}
                        </Text>
                        <Link
                            href={{
                                pathname: "/(app)/account/history/[banner]",
                                params: { accountId: props.accountId, banner },
                            }}
                            style={{
                                textAlignVertical: "center",
                                textAlign: "center",
                                color: Colors.button,
                                padding: 5,
                            }}
                        >
                            <FontAwesome
                                name="history"
                                size={24}
                                color={Colors.button}
                            />
                        </Link>
                    </View>
                    <View
                        style={{
                            backgroundColor: Colors.background,
                            padding: 10,
                            marginVertical: 5,
                            alignItems: "center",
                            borderRadius: 10,
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={{ color: Colors.textSecondary }}>
                            {"Last 4 \u2605 "}
                        </Text>
                        <Text style={{ color: Colors.fourStar }}>
                            {last4Star}
                        </Text>
                    </View>
                    <View
                        style={{
                            backgroundColor: Colors.background,
                            padding: 10,
                            marginVertical: 5,
                            alignItems: "center",
                            borderRadius: 10,
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={{ color: Colors.textSecondary }}>
                            {"Pity 4 \u2605 "}
                        </Text>
                        <Text style={{ color: Colors.fourStar }}>
                            {pity4Star}
                        </Text>
                    </View>
                    <View
                        style={{
                            backgroundColor: Colors.background,
                            padding: 10,
                            marginVertical: 5,
                            alignItems: "center",
                            borderRadius: 10,
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={{ color: Colors.textSecondary }}>
                            {"Last 5 \u2605 "}
                        </Text>
                        <Text style={{ color: Colors.fiveStar }}>
                            {last5Star}
                        </Text>
                    </View>
                    <View
                        style={{
                            backgroundColor: Colors.background,
                            padding: 10,
                            marginVertical: 5,
                            alignItems: "center",
                            borderRadius: 10,
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={{ color: Colors.textSecondary }}>
                            Pull Count:
                        </Text>
                        <Text style={{ color: Colors.textSecondary }}>
                            {pullCount}
                        </Text>
                    </View>
                </View>
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

import SpinningLogo from "@/components/spinningLogo"
import { Colors } from "@/constants/Colors"
import { Wish } from "@/types/types"
import cmsRequest from "@/utils/fetchUtils"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { FlatList, Image, Text, View } from "react-native"
import {
    Orientation,
    addOrientationChangeListener,
    removeOrientationChangeListeners,
} from "expo-screen-orientation"

/**
 * Banner History screen
 */
export default function History() {
    const { accountId, banner } = useLocalSearchParams()
    // listening to orientation is needed here
    // landscape orientation is not ideal when rendering this list
    const [orientation, setOrientation] = useState(Orientation.UNKNOWN)
    const [listState, setListState] = useState<{
        history: Wish[]
        loading: boolean
        offset: number
        limit: number
        hasMore: boolean
    }>({
        history: [],
        loading: false,
        offset: 0,
        limit: 20,
        hasMore: true,
    })

    const abortController = useRef<AbortController | null>(null)

    /**
     * Handles getting wish history
     */
    const getHistory = async () => {
        if (listState.hasMore && !listState.loading) {
            setListState((state) => ({
                ...state,
                loading: true,
            }))
            const docs: any[] = []
            let hasMore = false
            try {
                abortController.current = new AbortController()
                const req = await cmsRequest({
                    path: "api/genshin-accounts/getWishHistory",
                    method: "GET",
                    params: {
                        type: (typeof banner === "string"
                            ? banner
                            : banner[0]
                        ).toLowerCase(),
                        accountId: (typeof accountId === "string"
                            ? accountId
                            : accountId[0]
                        ).toLowerCase(),
                        offset: listState.offset + 1,
                        limit: listState.limit,
                    },
                    abortController: abortController.current,
                })
                docs.push(...req.data.history)
                hasMore = req.data.hasMore
                setListState((state) => ({
                    ...state,
                    loading: false,
                    history: [...state.history, ...docs],
                    offset: state.offset + 1,
                    hasMore: hasMore,
                }))
            } catch (error) {
                console.error("ERROR", error)
            }
        }
    }

    useEffect(() => {
        getHistory()
        // listen to orientation changes
        addOrientationChangeListener((e) => {
            setOrientation(e.orientationInfo.orientation)
        })
        return () => {
            // cleanup
            if (abortController.current) {
                abortController.current.abort()
            }
            removeOrientationChangeListeners()
        }
    }, [])

    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
            }}
        >
            <FlatList
                style={{ width: "100%" }}
                contentContainerStyle={{ alignItems: "center" }}
                data={listState.history}
                renderItem={({ item }) => {
                    const date = item.date.split(" ")
                    let itemColor = Colors.textSecondary
                    if (item.rarity === 4) {
                        itemColor = Colors.fourStar
                    } else if (item.rarity === 5) {
                        itemColor = Colors.fiveStar
                    }
                    return (
                        <View
                            key={item.wishNumber}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: Colors.content,
                                borderRadius: 5,
                                minHeight: 70,
                                width: "90%",
                                position: "relative",
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: itemColor,
                                    opacity: 0.3,
                                    width: "100%",
                                    height: "100%",
                                    padding: 10,
                                    borderRadius: 5,
                                    position: "absolute",
                                }}
                            ></View>
                            <Text
                                style={{
                                    flex: 1,
                                    color: Colors.textSecondary,
                                    textAlign: "center",
                                    fontSize: 10,
                                }}
                            >
                                {date[0] + "\n" + date[1]}
                            </Text>
                            <View
                                style={{
                                    flex: 2,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Image
                                    source={{ uri: item.item.icon.url }}
                                    height={35}
                                    width={35}
                                    style={{ marginHorizontal: 5 }}
                                />
                                {orientation === Orientation.LANDSCAPE_LEFT ||
                                orientation === Orientation.LANDSCAPE_RIGHT ? (
                                    <Text
                                        style={{
                                            color: itemColor,
                                            textAlign: "center",
                                            fontSize: 10,
                                        }}
                                    >
                                        {item.item.value}
                                    </Text>
                                ) : (
                                    <></>
                                )}
                            </View>
                            <Text
                                style={{
                                    flex: 1,
                                    color: itemColor,
                                    textAlign: "center",
                                }}
                            >
                                {item.rarity}
                            </Text>
                            <Text
                                style={{
                                    flex: 1,
                                    color: Colors.textSecondary,
                                    textAlign: "center",
                                }}
                            >
                                {item.pity}
                            </Text>
                            <Text
                                style={{
                                    flex: 1,
                                    color: Colors.textSecondary,
                                    textAlign: "center",
                                }}
                            >
                                {item.wishNumber}
                            </Text>
                        </View>
                    )
                }}
                ListEmptyComponent={() => {
                    return listState.loading ? (
                        <></>
                    ) : (
                        <View>
                            <Text
                                style={{
                                    color: Colors.textSecondary,
                                    fontWeight: "bold",
                                    fontSize: 20,
                                }}
                            >
                                {"No history :("}
                            </Text>
                        </View>
                    )
                }}
                // maxToRenderPerBatch={20}
                ListHeaderComponent={() => (
                    <View
                        style={{
                            minHeight: 50,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: Colors.content,
                            width: "90%",
                            padding: 10,
                            borderRadius: 5,
                            marginVertical: 10,
                            borderColor: Colors.backSecondary,
                            borderWidth: 2,
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.text,
                                fontWeight: "bold",
                                flex: 1,
                                textAlign: "center",
                            }}
                        >
                            Date
                        </Text>
                        <Text
                            style={{
                                color: Colors.text,
                                fontWeight: "bold",
                                flex: 2,
                                textAlign: "center",
                            }}
                        >
                            Item
                        </Text>
                        <Text
                            style={{
                                color: Colors.text,
                                fontWeight: "bold",
                                flex: 1,
                                textAlign: "center",
                            }}
                        >
                            {"\u2605"}
                        </Text>
                        <Text
                            style={{
                                color: Colors.text,
                                fontWeight: "bold",
                                flex: 1,
                                textAlign: "center",
                            }}
                        >
                            Pity
                        </Text>
                        <Text
                            style={{
                                color: Colors.text,
                                fontWeight: "bold",
                                flex: 1,
                                textAlign: "center",
                            }}
                        >
                            Wish Number
                        </Text>
                    </View>
                )}
                initialNumToRender={20}
                onEndReached={getHistory}
                onEndReachedThreshold={0.5}
                ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
                ListFooterComponent={() => {
                    return listState.loading ? <SpinningLogo /> : <></>
                }}
            />
        </View>
    )
}

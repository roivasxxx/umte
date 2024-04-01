import { useAccount } from "@/components/account/accountProvider"
import SpinningLogo from "@/components/spinningLogo"
import { Colors } from "@/constants/Colors"
import { itemTypeLabels } from "@/utils/constants"
import cmsRequest from "@/utils/fetchUtils"
import { router } from "expo-router"
import { setItem } from "expo-secure-store"
import { memo, useDeferredValue, useEffect, useMemo, useState } from "react"
import {
    Alert,
    FlatList,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"

type ItemState = {
    id: string
    name: string
    icon: string
    days: string[]
    selected: boolean
    type: string
}

export default function ItemNotifications() {
    const { account, setNotifications } = useAccount()
    const [items, setItems] = useState<ItemState[]>([])
    const [filter, setFilter] = useState<{ text: string; type: string[] }>({
        text: "",
        type: [],
    })
    const [loading, setLoading] = useState(true)
    const ITEM_TYPES = ["book", "weaponMat"]

    const deferredFilter = useDeferredValue(filter)

    const MemodSpinningLogo = memo(() => (
        <View>
            <SpinningLogo width={35} height={35} />
        </View>
    ))

    useEffect(() => {
        const abortController = new AbortController()
        const fetchItems = async () => {
            let items: ItemState[] = []
            try {
                const req = await cmsRequest({
                    path: "api/genshin-items/domainItems",
                    method: "GET",
                    abortController,
                })
                if (req.data) {
                    const accountIds = account.notifications.items.map(
                        (el) => el.id
                    )
                    items = req.data.map((el: Omit<ItemState, "selected">) => ({
                        ...el,
                        selected: accountIds.includes(el.id),
                    }))
                }
            } catch (e) {}
            setItems(items)
            setLoading(false)
        }
        fetchItems()

        return () => abortController.abort()
    }, [])

    const filteredData = useMemo(() => {
        return items.filter((item) => {
            // If no filter is present, include all items
            if (!deferredFilter.text && deferredFilter.type.length === 0) {
                return true
            }

            const matchesText =
                !deferredFilter.text ||
                item.name
                    .toLowerCase()
                    .includes(deferredFilter.text.toLowerCase())

            const matchesType =
                deferredFilter.type.length === 0 ||
                deferredFilter.type.includes(item.type)

            return matchesText && matchesType
        })
    }, [items, deferredFilter])

    return (
        <>
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "space-between",
                }}
            >
                <View style={{ width: "100%", flex: 12, padding: 10 }}>
                    {/* filter */}
                    <View style={{ flexDirection: "column" }}>
                        <TextInput
                            placeholder="Item name"
                            value={filter.text}
                            onChangeText={(e) =>
                                setFilter({ ...filter, text: e })
                            }
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
                        <View>
                            <ScrollView
                                horizontal
                                contentContainerStyle={{
                                    alignItems: "center",
                                    width: "100%",
                                    paddingVertical: 5,
                                }}
                            >
                                {ITEM_TYPES.map((item) => {
                                    return (
                                        <TouchableOpacity
                                            key={item}
                                            onPress={() => {
                                                setFilter({
                                                    ...filter,
                                                    type: filter.type.includes(
                                                        item
                                                    )
                                                        ? filter.type.filter(
                                                              (el) =>
                                                                  el !== item
                                                          )
                                                        : [
                                                              ...filter.type,
                                                              item,
                                                          ],
                                                })
                                            }}
                                            style={{
                                                padding: 15,
                                                backgroundColor:
                                                    filter.type.includes(item)
                                                        ? Colors.button
                                                        : Colors.content,
                                                borderRadius: 5,
                                                marginHorizontal: 5,
                                                flex: 1,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: "center",
                                                    color: Colors.text,
                                                }}
                                            >
                                                {
                                                    itemTypeLabels[
                                                        item as keyof typeof itemTypeLabels
                                                    ]
                                                }
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View>
                    </View>
                    <FlatList
                        data={filteredData}
                        contentContainerStyle={{
                            padding: 10,
                        }}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: item.selected
                                            ? Colors.button
                                            : Colors.content,
                                        padding: 15,
                                        marginVertical: 5,
                                        borderRadius: 5,
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                    onPress={() => {
                                        setItems(
                                            items.map((el) => {
                                                if (el.id === item.id) {
                                                    return {
                                                        ...el,
                                                        selected: !el.selected,
                                                    }
                                                }
                                                return el
                                            })
                                        )
                                    }}
                                >
                                    <Image
                                        source={{
                                            uri: item.icon,
                                        }}
                                        width={35}
                                        height={35}
                                    />
                                    <Text
                                        style={{
                                            color: Colors.text,
                                            paddingHorizontal: 5,
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: loading
                            ? Colors.content
                            : Colors.button,
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        width: "100%",
                    }}
                    disabled={loading}
                    onPress={async () => {
                        if (setNotifications) {
                            setLoading(true)
                            const result = await setNotifications(
                                "items",
                                items
                                    .filter((el) => el.selected)
                                    .map((el) => {
                                        const { selected, ...rest } = el
                                        return rest
                                    })
                            )
                            Alert.alert(
                                result ? "Success" : "Error",
                                result
                                    ? "Item notifications saved"
                                    : "Error saving item notifications",
                                [
                                    {
                                        text: "OK",
                                        onPress: () =>
                                            router.replace("/(app)/account"),
                                    },
                                ]
                            )
                            setLoading(false)
                        }
                    }}
                >
                    {loading ? (
                        <MemodSpinningLogo />
                    ) : (
                        <Text
                            style={{
                                color: Colors.text,
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: 18,
                            }}
                        >
                            Save
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </>
    )
}

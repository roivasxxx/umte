import SpinningLogo from "@/components/spinningLogo"
import { Colors } from "@/constants/Colors"
import { GenshinCharacter } from "@/types/types"
import cmsRequest from "@/utils/fetchUtils"
import { SimpleLineIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { memo, useDeferredValue, useEffect, useMemo, useState } from "react"
import {
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"

/**
 * All characters list screen
 * No pagination is implemented, because there are not that many elements that would need to be rendered
 */
export default function Index() {
    const [items, setItems] = useState<GenshinCharacter[]>([])
    const [filterOptions, setFilterOptions] = useState<{
        elements: { name: string; icon: string }[]
    }>({
        elements: [],
    })
    const [filter, setFilter] = useState<{
        text: string
        element: string[]
    }>({
        text: "",
        element: [],
    })
    const [loading, setLoading] = useState(true)
    const deferredFilter = useDeferredValue(filter)

    const MemodSpinningLogo = memo(
        (props: { width: number; height: number }) => (
            <View>
                <SpinningLogo {...props} />
            </View>
        )
    )

    const filteredData = useMemo(() => {
        return items.filter((item) => {
            // If no filter is present, include all items
            if (!deferredFilter.text && deferredFilter.element.length === 0) {
                return true
            }

            const matchesText =
                !deferredFilter.text ||
                item.name
                    .toLowerCase()
                    .includes(deferredFilter.text.toLowerCase())

            const matchesType =
                deferredFilter.element.length === 0 ||
                deferredFilter.element.includes(item.element.name)

            return matchesText && matchesType
        })
    }, [items, deferredFilter])

    useEffect(() => {
        const abortController = new AbortController()
        const fetchItems = async () => {
            let items: GenshinCharacter[] = []
            let elements: typeof filterOptions.elements = []
            try {
                const req = await cmsRequest({
                    path: "api/genshin-characters/getGenshinCharacters",
                    method: "GET",
                    abortController,
                })
                if (req.data) {
                    items = req.data
                }
                const elementReq = await cmsRequest({
                    path: "api/genshin-elements/getElements",
                    method: "GET",
                })
                if (elementReq.data) {
                    elements = elementReq.data
                }
                if (elementReq.data) {
                }
            } catch (e) {}
            setItems(items)
            setFilterOptions({ ...filterOptions, elements: elements })
            setLoading(false)
        }
        fetchItems()

        return () => abortController.abort()
    }, [])

    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                justifyContent: "space-between",
            }}
        >
            <View style={{ width: "100%", flex: 12, padding: 10 }}>
                <View style={{ flexDirection: "column" }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                            padding: 10,
                            borderRadius: 5,
                            borderColor: Colors.border,
                            borderWidth: 2,
                            marginBottom: 10,
                            alignItems: "center",
                            backgroundColor: Colors.content,
                        }}
                    >
                        <TextInput
                            placeholder="Character name"
                            value={filter.text}
                            onChangeText={(e) =>
                                setFilter({ ...filter, text: e })
                            }
                            style={{
                                color: Colors.text,
                                flex: 10,
                            }}
                            clearButtonMode="never"
                            placeholderTextColor={Colors.text}
                        />
                        <TouchableOpacity
                            style={{
                                paddingHorizontal: 5,
                                position: "absolute",
                                right: 0,
                            }}
                            onPress={() => setFilter({ ...filter, text: "" })}
                        >
                            <SimpleLineIcons
                                name="close"
                                size={18}
                                color={Colors.button}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        {loading ? (
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <MemodSpinningLogo width={50} height={50} />
                            </View>
                        ) : (
                            <FlatList
                                data={filterOptions.elements}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        key={item.name}
                                        onPress={() => {
                                            setFilter({
                                                ...filter,
                                                element:
                                                    filter.element.includes(
                                                        item.name
                                                    )
                                                        ? filter.element.filter(
                                                              (el) =>
                                                                  el !==
                                                                  item.name
                                                          )
                                                        : [
                                                              ...filter.element,
                                                              item.name,
                                                          ],
                                            })
                                        }}
                                        style={{
                                            padding: 5,
                                            backgroundColor:
                                                filter.element.includes(
                                                    item.name
                                                )
                                                    ? Colors.button
                                                    : Colors.content,
                                            borderRadius: 5,
                                            marginHorizontal: 5,
                                            width: 70,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Image
                                            source={{ uri: item.icon }}
                                            width={50}
                                            height={50}
                                        />
                                    </TouchableOpacity>
                                )}
                                horizontal
                                contentContainerStyle={{
                                    alignItems: "center",
                                    // width: "100%",
                                    paddingVertical: 5,
                                }}
                                ListEmptyComponent={() => (
                                    <Text>{"No elements found :("}</Text>
                                )}
                            />
                        )}
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
                                    backgroundColor: Colors.content,
                                    padding: 15,
                                    marginVertical: 5,
                                    borderRadius: 5,
                                }}
                                onPress={() => {
                                    router.push({
                                        pathname:
                                            "/(app)/database/genshin-characters/[id]",
                                        params: { id: item.id },
                                    })
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            flex: 8,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Image
                                                source={{
                                                    uri: item.icon,
                                                }}
                                                width={35}
                                                height={35}
                                            />
                                            <View
                                                style={{
                                                    paddingHorizontal: 15,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: Colors.text,
                                                        fontSize: 16,
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {item.name}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: Colors.fiveStar,
                                                        fontSize: 10,
                                                    }}
                                                >
                                                    {new Array(item.rarity)
                                                        .fill("\u2605")
                                                        .join("")}
                                                </Text>
                                                <Image
                                                    source={{
                                                        uri: item.element.icon,
                                                    }}
                                                    width={20}
                                                    height={20}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <SimpleLineIcons
                                        style={{ flex: 1 }}
                                        name="arrow-right"
                                        size={24}
                                        color={Colors.button}
                                    />
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    ListEmptyComponent={() => {
                        return loading ? (
                            <MemodSpinningLogo width={200} height={200} />
                        ) : (
                            <Text
                                style={{
                                    color: Colors.text,
                                    fontSize: 20,
                                    fontWeight: "bold",
                                }}
                            >
                                {"No characters found :("}
                            </Text>
                        )
                    }}
                />
            </View>
        </View>
    )
}

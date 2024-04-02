import { Colors } from "@/constants/Colors"
import cmsRequest from "@/utils/fetchUtils"
import { useDeferredValue, useEffect, useMemo, useState } from "react"
import {
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
    substat: string
    weaponType: string
    element: {
        name: string
        icon: string
    }
    specialty: {
        name: string
        icon: string
    }
    talent: {
        name: string
        icon: string
    }
    trounce: {
        name: string
        icon: string
    }
    boss: {
        name: string
        icon: string
    }
    books: {
        name: string
        icon: string
    }[]
}

// render all items here
export default function Index() {
    const [items, setItems] = useState<ItemState[]>([])
    const [filter, setFilter] = useState<{
        text: string
        element: { name: string; icon: string }[]
    }>({
        text: "",
        element: [],
    })
    const [loading, setLoading] = useState(true)
    const deferredFilter = useDeferredValue(filter)

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
                deferredFilter.element
                    .map((el) => el.name)
                    .includes(item.element.name)

            return matchesText && matchesType
        })
    }, [items, deferredFilter])

    useEffect(() => {
        const abortController = new AbortController()
        const fetchItems = async () => {
            let items: ItemState[] = []
            let elements: typeof filter.element = []
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
            setFilter({ ...filter, element: elements })
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
                    <TextInput
                        placeholder="Character name"
                        value={filter.text}
                        onChangeText={(e) => setFilter({ ...filter, text: e })}
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
                            {filter.element.map((item) => {
                                return (
                                    <TouchableOpacity
                                        key={item.name}
                                        onPress={() => {
                                            setFilter({
                                                ...filter,
                                                element: filter.element
                                                    .map((el) => el.name)
                                                    .includes(item.name)
                                                    ? filter.element.filter(
                                                          (el) =>
                                                              el.name !==
                                                              item.name
                                                      )
                                                    : [...filter.element, item],
                                            })
                                        }}
                                        style={{
                                            padding: 15,
                                            backgroundColor:
                                                filter.element.includes(item)
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
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </View>
    )
}

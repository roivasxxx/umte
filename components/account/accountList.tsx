import { FlatList, Image, SectionList, Text, View } from "react-native"
import { useAccount } from "./accountProvider"
import { Colors } from "@/constants/Colors"
import { Link } from "expo-router"
import { GAME_ICONS } from "@/utils/imageUtils"
import SpinningLogo from "../spinningLogo"
import { AntDesign } from "@expo/vector-icons"
export default function AccountList() {
    const { account } = useAccount()

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 15,
                }}
            >
                <Text
                    style={{
                        color: Colors.text,
                        fontWeight: "bold",
                        fontSize: 18,
                    }}
                >
                    Accounts
                </Text>
                <Link href="/(app)/account/new">
                    <AntDesign
                        name="pluscircle"
                        size={26}
                        color={Colors.button}
                    />
                </Link>
            </View>
            <FlatList
                data={account.genshinAccounts}
                renderItem={({ item }) => {
                    return (
                        <Link
                            style={{
                                padding: 15,
                                backgroundColor: Colors.content,
                                borderRadius: 5,
                                marginVertical: 5,
                            }}
                            href={{
                                pathname: `/(app)/account/[id]`,
                                params: {
                                    id: item.id,
                                    game: item.game,
                                    hoyoId: item.hoyoId || "",
                                    region: item.region || "",
                                },
                            }}
                            key={item.id}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    source={
                                        GAME_ICONS[
                                            item.game as keyof typeof GAME_ICONS
                                        ]
                                    }
                                    style={{
                                        width: 50,
                                        height: 50,
                                        marginRight: 10,
                                        borderRadius: 25,
                                    }}
                                />
                                <View>
                                    <Text style={{ color: Colors.button }}>
                                        {item.hoyoId || item.id}
                                    </Text>
                                    <Text style={{ color: Colors.text }}>
                                        {item?.region || ""}
                                    </Text>
                                </View>
                            </View>
                        </Link>
                    )
                }}
                ListEmptyComponent={() => {
                    return account.loading ? (
                        <SpinningLogo />
                    ) : (
                        <Text
                            style={{
                                color: Colors.textSecondary,
                                fontSize: 18,
                            }}
                        >
                            {"No Accounts :("}
                        </Text>
                    )
                }}
            />
        </View>
    )
}

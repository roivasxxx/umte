import { Text, TouchableOpacity, View } from "react-native"
import { useAccount } from "./accountProvider"
import { Colors } from "@/constants/Colors"
import NotificationCheckbox from "./notificationCheckbox"
import SpinningLogo from "../spinningLogo"
import { Link, router } from "expo-router"
import { SimpleLineIcons } from "@expo/vector-icons"

export default function NotificationSettingsList() {
    const {
        account: { notifications, loading },
    } = useAccount()

    return (
        <View style={{ flex: 1 }}>
            <Text
                style={{
                    color: Colors.text,
                    fontWeight: "bold",
                    fontSize: 18,
                }}
            >
                Notifications
            </Text>
            {loading ? (
                <SpinningLogo />
            ) : (
                <>
                    <NotificationCheckbox
                        value={notifications.banners}
                        text="Banners"
                        prop="banners"
                    />
                    <NotificationCheckbox
                        value={notifications.events}
                        text="Events"
                        prop="events"
                    />
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/(app)/account/item-notifications")
                        }
                        style={{
                            backgroundColor: Colors.content,
                            minHeight: 50,
                            borderRadius: 5,
                            marginVertical: 5,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.text,
                                textAlign: "center",
                                fontSize: 16,
                                padding: 5,
                            }}
                        >
                            Items
                        </Text>
                        <SimpleLineIcons
                            name="arrow-right"
                            size={24}
                            color={Colors.button}
                        />
                    </TouchableOpacity>
                </>
            )}
        </View>
    )
}

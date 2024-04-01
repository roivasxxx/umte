import { Text, View } from "react-native"
import { useAccount } from "./accountProvider"
import { Colors } from "@/constants/Colors"
import NotificationCheckbox from "./notificationCheckbox"
import SpinningLogo from "../spinningLogo"

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
                </>
            )}
        </View>
    )
}

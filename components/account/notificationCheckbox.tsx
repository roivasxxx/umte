import { Colors } from "@/constants/Colors"
import { Text, TouchableOpacity, View } from "react-native"
import { useAccount } from "./accountProvider"

/**
 * Notification checkbox
 * if value is true, the checkbox is checked -> the component is green
 * false, checkbox is not checked -> the component is red
 */
export default function NotificationCheckbox(props: {
    prop: "banners" | "events"
    text: "Banners" | "Events"
    value: boolean
}) {
    const { setNotifications } = useAccount()

    return (
        <TouchableOpacity
            style={{
                backgroundColor: Colors.content,
                marginVertical: 5,
                borderRadius: 5,
                alignItems: "center",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                minHeight: 50,
            }}
            onPress={async () => {
                if (setNotifications) {
                    await setNotifications(props.prop, !props.value)
                }
            }}
        >
            <View
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                    opacity: 0.3,
                    padding: 10,
                    backgroundColor: props.value ? "green" : "red",
                }}
            />

            <Text
                style={{
                    color: Colors.textSecondary,
                    fontSize: 16,
                    padding: 5,
                }}
            >
                {props.text}
            </Text>
        </TouchableOpacity>
    )
}

import AccountList from "@/components/account/accountList"
import NotificationSettingsList from "@/components/account/notificationSettingsList"
import { useSession } from "@/components/auth/authProvider"
import { Colors } from "@/constants/Colors"
import { Text, TouchableOpacity, View } from "react-native"

export default function Account() {
    const { signOut, session } = useSession()

    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                padding: 10,
                flexDirection: "column",
                // justifyContent: "flex-end",
            }}
        >
            <Text
                style={{
                    color: Colors.text,
                    fontWeight: "bold",
                    fontSize: 20,
                    textAlign: "center",
                }}
            >
                {session?.email}
            </Text>

            <AccountList />
            <NotificationSettingsList />
            <TouchableOpacity
                onPress={signOut}
                style={{
                    backgroundColor: Colors.button,
                    padding: 10,
                    borderRadius: 5,
                    bottom: 0,
                }}
            >
                <Text style={{ textAlign: "center", color: Colors.text }}>
                    Sign out
                </Text>
            </TouchableOpacity>
        </View>
    )
}

import AccountList from "@/components/account/accountList"
import { useAccount } from "@/components/account/accountProvider"
import { useSession } from "@/components/auth/authProvider"
import { Colors } from "@/constants/Colors"
import { FlatList, Text, TouchableOpacity, View } from "react-native"

export default function Account() {
    const { signOut, session } = useSession()
    const { account } = useAccount()

    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                padding: 10,
                flexDirection: "column",
                justifyContent: "flex-end",
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
            {/* <View
            // style={{
            //     position: "absolute",
            //     bottom: 0,
            //     left: 0,
            //     width: "100%",
            // }}
            ></View> */}
            <TouchableOpacity
                onPress={signOut}
                style={{
                    backgroundColor: Colors.button,
                    padding: 10,
                    borderRadius: 5,
                }}
            >
                <Text style={{ textAlign: "center", color: Colors.text }}>
                    Sign out
                </Text>
            </TouchableOpacity>
        </View>
    )
}

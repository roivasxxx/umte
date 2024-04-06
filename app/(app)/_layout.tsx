import { useSession } from "@/components/auth/authProvider"
import { Redirect, Tabs } from "expo-router"
import { Colors } from "@/constants/Colors"

import { FontAwesome } from "@expo/vector-icons"
import AccountProvider from "@/components/account/accountProvider"
export default function AppTabLayout() {
    const { session } = useSession()
    if (!session) {
        return <Redirect href="/" />
    }

    return (
        <>
            <AccountProvider>
                <Tabs
                    screenOptions={{
                        headerShown: false,
                        tabBarActiveTintColor: Colors.button,
                        tabBarInactiveTintColor: Colors.text,
                        tabBarStyle: {
                            backgroundColor: Colors.background,
                            justifyContent: "space-between",
                            alignItems: "center",
                        },
                        tabBarLabelStyle: {
                            display: "none",
                        },
                    }}
                >
                    <Tabs.Screen
                        name="account"
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ color }) => (
                                <FontAwesome
                                    name="user"
                                    size={24}
                                    color={color}
                                />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="database"
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ color }) => (
                                <FontAwesome
                                    name="database"
                                    size={24}
                                    color={color}
                                />
                            ),
                        }}
                    />
                </Tabs>
            </AccountProvider>
        </>
    )
}

import { ACCOUNT_REGIONS, NotificationItemType } from "@/types/types"
import cmsRequest from "@/utils/fetchUtils"
import { createDeepCopy } from "@/utils/utils"
import {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
} from "react"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { Platform } from "react-native"

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
})

type GenshinAccountState = {
    genshinAccounts: any[]
    notifications: {
        events: boolean
        banners: boolean
        items: NotificationItemType[]
    }
    loading: boolean
}

type AccountContext = {
    account: GenshinAccountState
    setNotifications:
        | (<T extends keyof GenshinAccountState["notifications"]>(
              prop: T,
              value: GenshinAccountState["notifications"][T]
          ) => Promise<boolean>)
        | null
    createGenshinAccount:
        | ((acc: {
              region: ACCOUNT_REGIONS
              hoyoId: string
          }) => Promise<string>)
        | null
    registerDevicePushTokenAsync: (token: string) => Promise<void> | null
    registerForPushNotificationsAsync: () => Promise<void> | null
    testUserNotification: () => Promise<void> | null
}

const defaultAccountState: GenshinAccountState = {
    genshinAccounts: [],
    notifications: {
        events: false,
        banners: false,
        items: [],
    },
    loading: true,
}

const AccountContext = createContext<AccountContext>({
    account: defaultAccountState,
    setNotifications: null,
    createGenshinAccount: null,
    registerDevicePushTokenAsync: () => null,
    registerForPushNotificationsAsync: () => null,
    testUserNotification: () => null,
})

export const useAccount = () => useContext(AccountContext)

export default function AccountProvider(props: { children: ReactNode }) {
    const [account, setAccount] =
        useState<GenshinAccountState>(defaultAccountState)

    async function getAccountData() {
        const _account = createDeepCopy(defaultAccountState)
        try {
            const res = await cmsRequest({
                path: "api/public-users/me",
                method: "GET",
                params: {},
            })
            const data = res.data
            if (data && data.user) {
                if (
                    data.user.genshinAccounts &&
                    Array.isArray(data.user.genshinAccounts) &&
                    data.user.genshinAccounts.length > 0
                ) {
                    _account.genshinAccounts = data.user.genshinAccounts.map(
                        (el: any) => ({
                            id: el.id,
                            region: el.region || "",
                            hoyoId: el.hoyo_id || "",
                            game: "genshin",
                        })
                    )
                }
                if (data.user.tracking) {
                    _account.notifications = {
                        ...data.user.tracking,
                        items: data.user.tracking.items
                            ? data.user.tracking.items.map((el: any) => {
                                  return {
                                      name: el.name,
                                      id: el.id,
                                      icon: el.icon.cloudinary.secure_url,
                                      days: el.days,
                                  }
                              })
                            : [],
                    }
                }
            }
        } catch (error) {
            console.error("Error getting account data", error)
        }
        setAccount({ ..._account, loading: false })
    }

    useEffect(() => {
        getAccountData()

        const subscription = Notifications.addPushTokenListener((token) =>
            registerDevicePushTokenAsync(token.data)
        )
        return () => subscription.remove()
    }, [])

    const setNotifications = async <
        T extends keyof GenshinAccountState["notifications"]
    >(
        prop: T,
        value: GenshinAccountState["notifications"][T]
    ) => {
        const _account: GenshinAccountState = {
            ...account,
            notifications: {
                ...account.notifications,
                [prop]: value,
            },
        }
        setAccount(_account)
        try {
            await cmsRequest({
                path: "api/public-users/setNotificationSettings",
                method: "POST",
                body: {
                    ..._account.notifications,
                    items: _account.notifications.items.map((el) => el.id),
                },
            })
            return true
        } catch (error) {
            console.error("Error setting notifications", error)
        }
        return false
    }
    const createGenshinAccount = async (acc: {
        region: ACCOUNT_REGIONS
        hoyoId: string
    }) => {
        try {
            const response = await cmsRequest({
                path: "api/genshin-accounts/create-genshin-account",
                method: "POST",
                body: {
                    ...acc,
                },
            })
            if (response.data.accountId) {
                await getAccountData()
                return response.data.accountId as string
            }
        } catch (error) {
            console.error("Error creating genshin account", error)
        }
        return ""
    }

    /**
     * Handles setting the user's push token
     */
    async function registerDevicePushTokenAsync(expoPushToken: string) {
        try {
            await cmsRequest({
                path: "/api/public-users/setExpoPushToken",
                method: "POST",
                body: { expoPushToken },
            })
        } catch (error) {
            console.error("Failed to set expo push token", error)
        }
    }

    /**
     * Handles getting the user's push token, handles permissions etc
     */
    async function registerForPushNotificationsAsync(): Promise<void> {
        let token

        if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            })
        }

        if (Device.isDevice) {
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync()
            let finalStatus = existingStatus
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync()
                finalStatus = status
            }
            if (finalStatus !== "granted") {
                alert("Failed to get push token for push notification!")
                return
            }
            token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants?.expoConfig?.extra?.eas.projectId,
            })
        } else {
            alert("Must use physical device for Push Notifications")
            return
        }

        await registerDevicePushTokenAsync(token.data)
    }

    async function testUserNotification() {
        try {
            await cmsRequest({
                method: "GET",
                path: "/api/public-users/sendExpoNotifications",
            })
        } catch (error) {
            console.error("testUserNotification threw an error", error)
        }
    }

    return (
        <AccountContext.Provider
            value={{
                account,
                setNotifications,
                createGenshinAccount,
                registerDevicePushTokenAsync,
                registerForPushNotificationsAsync,
                testUserNotification,
            }}
        >
            {props.children}
        </AccountContext.Provider>
    )
}

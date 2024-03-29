import cmsRequest from "@/utils/fetchUtils"
import { createDeepCopy } from "@/utils/utils"
import {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
} from "react"

type GenshinAccountState = {
    genshinAccounts: any[]
}

type AccountContext = {
    account: GenshinAccountState
}

const defaultAccountState: GenshinAccountState = {
    genshinAccounts: [],
}

const AccountContext = createContext<AccountContext>({
    account: defaultAccountState,
})

export const useAccount = () => useContext(AccountContext)

export default function AccountProvider(props: { children: ReactNode }) {
    const [account, setAccount] =
        useState<GenshinAccountState>(defaultAccountState)

    async function getAccountData() {
        try {
            const res = await cmsRequest({
                path: "api/public-users/me",
                method: "GET",
            })
            const data = res.data
            if (data && data.user) {
                console.log(data.user.genshinAccounts)
                const _account = createDeepCopy(defaultAccountState)
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

                setAccount(_account)
            }
        } catch (error) {
            console.error("Error getting account data", error)
        }
    }

    useEffect(() => {
        getAccountData()
    }, [])

    return (
        <AccountContext.Provider value={{ account }}>
            {props.children}
        </AccountContext.Provider>
    )
}

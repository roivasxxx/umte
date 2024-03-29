import { useLocalSearchParams } from "expo-router"
import { Text } from "react-native"

export default function History() {
    const { accountId, banner } = useLocalSearchParams()
    return <Text>History</Text>
}

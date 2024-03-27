import { useSession } from '@/components/auth/authProvider'
import { router } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Button, Text, View } from 'react-native'

export default function App() {
    const { signIn, loading } = useSession()
    if (loading) {
        return <ActivityIndicator />
    }
    return (
        <View>
            <Text>Hello expo!</Text>
            <Button
                title="log me in nigga"
                onPress={() => {
                    signIn()
                    router.replace('/home')
                }}
            ></Button>
        </View>
    )
}

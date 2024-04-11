import { useEffect } from "react"
import { Animated, Easing } from "react-native"
import Splash from "../assets/images/splash.svg"

/**
 * Used as a loading indicator in the app
 */
export default function SpinningLogo({ width = 200, height = 200 }) {
    const spinValue = new Animated.Value(0)
    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "-360deg"],
    })

    const spin = () => {
        spinValue.setValue(0)
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 5000,
                useNativeDriver: true,
                easing: Easing.linear,
            })
        ).start()
    }

    useEffect(() => {
        spin()
    }, [])

    return (
        <Animated.View
            style={[
                {
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 40,
                },
                { transform: [{ rotate: rotate }] },
            ]}
        >
            <Splash width={width} height={height} />
        </Animated.View>
    )
}

import { useEffect, memo } from "react"
import { Animated, Easing } from "react-native"
import Splash from "../assets/images/splash.svg"

/**
 * Used as a loading indicator in the app
 */
const SpinningLogo = memo(function SpinningLogo({
    width = 200,
    height = 200,
}: {
    width?: number
    height?: number
}) {
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
                },
                { transform: [{ rotate: rotate }] },
            ]}
        >
            <Splash width={width} height={height} />
        </Animated.View>
    )
})

export default SpinningLogo

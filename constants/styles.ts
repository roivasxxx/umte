import { StyleSheet } from "react-native"

// global styles, that are not exactly used in the app
const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    FLEX_CENTERED_COLUMN: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },
})

export default styles

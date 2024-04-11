import ErrorBoundary from "@/components/errorBoundary"
import SpinningLogo from "@/components/spinningLogo"
import { Colors } from "@/constants/Colors"
import { GenshinCharacter } from "@/types/types"
import cmsRequest, { ResourceType, createResource } from "@/utils/fetchUtils"
import { capitalizeString } from "@/utils/utils"
import { useLocalSearchParams } from "expo-router"
import { Suspense } from "react"
import { Image, ScrollView, StyleSheet, Text, View } from "react-native"

const styles = StyleSheet.create({
    propContainer: {
        alignItems: "center",
        width: 70,
        height: 80,
    },
    propText: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    propTextSecondary: {
        textAlign: "center",
        color: Colors.textSecondary,
        textAlignVertical: "center",
    },
    propRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: 15,
    },
})

/**
 * Character detail component
 * This component lives inside a React.Suspense
 */
const CharacterDetail = (props: { resource: ResourceType }) => {
    const res = props.resource.read()

    const character: GenshinCharacter = res?.data

    return (
        <View
            style={{
                alignItems: "center",
                paddingVertical: 15,
                backgroundColor: Colors.content,
                borderRadius: 5,
            }}
        >
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Image
                    source={{ uri: character.icon }}
                    width={70}
                    height={70}
                />
                <Text
                    style={{
                        textAlign: "center",
                        paddingVertical: 5,
                        color: Colors.text,
                        fontSize: 20,
                        fontWeight: "bold",
                    }}
                >
                    {character?.name}
                </Text>
                <Text
                    style={{
                        color: Colors.fiveStar,
                        fontSize: 15,
                        textAlign: "center",
                    }}
                >
                    {new Array(character.rarity).fill("\u2605").join("")}
                </Text>
                <Image
                    source={{ uri: character.element.icon }}
                    width={50}
                    height={50}
                    style={{ alignSelf: "center" }}
                />

                <View
                    style={{
                        marginTop: 10,
                        marginHorizontal: 10,
                        backgroundColor: Colors.background,
                        borderRadius: 5,
                    }}
                >
                    <View style={styles.propRow}>
                        <View>
                            <Text style={styles.propText}>Weapon Type</Text>
                            <Text style={styles.propTextSecondary}>
                                {capitalizeString(character.weaponType)}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.propText}>
                                Level Up Substat
                            </Text>
                            <Text style={styles.propTextSecondary}>
                                {character.substat
                                    .split("_")
                                    .map(capitalizeString)
                                    .join(" ")}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.propRow}>
                        <View style={styles.propContainer}>
                            <Text style={styles.propText}>Level Up</Text>
                            <Image
                                source={{ uri: character.gem.icon }}
                                width={50}
                                height={50}
                            />
                        </View>

                        <View style={styles.propContainer}>
                            <Text style={styles.propText}>Boss</Text>
                            {character.boss ? (
                                <Image
                                    source={{ uri: character.boss.icon }}
                                    width={50}
                                    height={50}
                                />
                            ) : (
                                <Text style={styles.propTextSecondary}>
                                    None
                                </Text>
                            )}
                        </View>
                        <View style={styles.propContainer}>
                            <Text style={styles.propText}>Specialty</Text>
                            <Image
                                source={{ uri: character.specialty.icon }}
                                width={50}
                                height={50}
                            />
                        </View>
                    </View>

                    <View style={styles.propRow}>
                        <View style={styles.propContainer}>
                            <Text style={styles.propText}>Enemy Drop</Text>
                            <Image
                                source={{ uri: character.talent.icon }}
                                width={50}
                                height={50}
                            />
                        </View>

                        <View style={styles.propContainer}>
                            <Text style={styles.propText}>Talent Book</Text>
                            <Image
                                source={{ uri: character.books[0].icon }}
                                width={50}
                                height={50}
                            />
                        </View>
                        <View style={styles.propContainer}>
                            <Text style={styles.propText}>Weekly Boss</Text>
                            <Image
                                source={{ uri: character.trounce.icon }}
                                width={50}
                                height={50}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

/**
 * Specific character page
 */
export default function Character() {
    const { id } = useLocalSearchParams()

    const resource = createResource(
        cmsRequest({
            path: `api/genshin-characters/getGenshinCharacter`,
            method: "GET",
            params: { id: typeof id === "string" ? id : id[0] },
        })
    )

    return (
        <ScrollView
            style={{
                width: "100%",
                height: "100%",
                padding: 10,
            }}
        >
            <ErrorBoundary
                fallback={
                    <View>
                        <Text
                            style={{
                                color: Colors.text,
                                fontSize: 20,
                                fontWeight: "bold",
                            }}
                        >
                            {"Unknown character :("}
                        </Text>
                    </View>
                }
            >
                <Suspense fallback={<SpinningLogo />}>
                    <CharacterDetail resource={resource} />
                </Suspense>
            </ErrorBoundary>
        </ScrollView>
    )
}

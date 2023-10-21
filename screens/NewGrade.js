import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    Alert
} from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
//import RNPickerSelect from 'react-native-picker-select';

const NewGrade = () => {
    const navigation = useNavigation();

    const route = useRoute();
    const subId = route.params.sub_id
    const [Name, setName] = useState("");
    const [Weight, setWeight] = useState("");
    const [GradeV, setGradeV] = useState("");
    const [days, setDays] = useState();
    const [hours, setHours] = useState();
    const [methods, setMethods] = useState([]);
    const [special, setSpecial] = useState(false);
    const [specialText, setSpecialText] = useState("Normale Vorbereitung");
    const [tips, setTips] = useState("");
    const learnmethods = [
        "Aufgaben/Fallbeispiele lösen", "Texte/Artikel/Unterlagen lesen", "Zusammenfassungen schreiben",
        "Blurting", "Karteikarten", "Den Stoff jemandem erklären",
        "Visualisierung (z.B. Mindmap)"
    ]
    const [selMethods, setSelMethods] = useState([]);
    const handleGrade = () => {
        var ipts = [Weight, GradeV, Name];
        const allInputsFilled = ipts.every((input) => input.trim() !== '');

        if (allInputsFilled) {
            const Grade = {
                "name": Name,
                "grade": parseFloat(GradeV),
                "weight": parseFloat(Weight),
                "days": parseFloat(days),
                "hours": parseFloat(hours),
                "methods": selMethods,
                "tips": tips,
                "subject_id": subId
            };
            if (Grade.grade <= 0) {
                Grade.grade = 0;
            }
            if (Grade.weight < 0) {
                Grade.weight = 1;
            }
            if (Grade.days <= 0) {
                Grade.days = 0;
            }
            if (Grade.hours <= 0) {
                Grade.hours = 0;
            }
            // here, we send the grade, but also calculate all the important figures:
            // average of subject and semester
            // pluspoints of subject and semester
            axios.post("http://192.168.0.102:8000/grades", Grade)
                .then((response) => {
                    setName("");
                    setWeight("");
                    setGradeV("");
                    setDays("");
                    setHours("");
                    setSelMethods([]);
                    setTips("");
                    navigation.navigate("Subjects", route.params);
                })
                .catch((error) => {
                    console.log("registration failed", error);
                });
    
        } else {
            Alert.alert("Die Note wurde nicht hinzugefügt. 😔",
            "Bitte gib mindestens Name, Gewichtung und Note an.")
        }
    }


    const [loaded] = useFonts({
        InterB: require('../assets/fonts/Inter-Bold.ttf'),
        InterM: require('../assets/fonts/Inter-Medium.ttf'),
        InterR: require('../assets/fonts/Inter-Regular.ttf'),
        PDRegular: require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
        PDBold: require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
        PDSemi: require('../assets/fonts/PlayfairDisplay-SemiBold.ttf'),
    });

    if (!loaded) {
        return null;
    }

    const handleMethod = (term) => {
        if (selMethods.includes(term)) {
            setSelMethods(selMethods.filter((t) => t !== term));
        } else {
            setSelMethods([...selMethods, term]);
        }
    }

    const handleSpecial = () => {
        if (special) {
            setSpecial(false);
            setSpecialText("Normale Vorbereitung");
        } else {
            setSpecial(true);
            setSpecialText("Aussergewöhnliche Vorbereitung");
        }
    }

    const displayFurther = () => {
        if (special) {
            return (
                <View></View>
            )
        } else {
            return (
                <View>
                    <Text style={{
                            marginTop: 15,
                            color: 'white',
                            fontSize: 20,
                            fontFamily: 'InterM',
                        }}>Wie viele Tage vor der Prüfung hast du angefangen zu lernen?</Text>
                    <TextInput
                        keyboardType='numeric'
                        value={days}
                        onChangeText={
                            (text) => {
                                setDays(text);
                            }
                        }
                        style={{
                            fontSize: days ? 24 : 24,
                            marginTop: 10,
                            width: '100%',
                            padding: 10,
                            borderRadius: 10,
                            color: 'white',
                            backgroundColor: '#1B1F47',
                            fontFamily: 'InterM'
                        }}
                    />

                    <Text style={{
                        marginTop: 10,
                        color: 'white',
                        fontSize: 20,
                        fontFamily: 'InterM',
                    }}>Wie viele Stunden hast du gelernt?</Text>
                    <TextInput
                        keyboardType='numeric'
                        value={hours}
                        onChangeText={
                            (text) => {
                                setHours(text);
                            }
                        }
                        style={{
                            fontSize: hours ? 24 : 24,
                            marginTop: 10,
                            width: '100%',
                            padding: 10,
                            borderRadius: 10,
                            color: 'white',
                            backgroundColor: '#1B1F47',
                            fontFamily: 'InterM'
                        }}
                    />

                    <Text style={{
                        marginTop: 10,
                        color: 'white',
                        fontSize: 20,
                        fontFamily: 'InterM',
                        marginBottom: 10,
                    }}>Welche Lernmethoden hast du genutzt?</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {learnmethods.map((method) => (
                            <Pressable key={method}
                                onPress={() => handleMethod(method)}
                                style={{
                                    padding: 10,
                                    backgroundColor: selMethods.includes(method) ? '#FFB600' : '#1B1F47',
                                    margin: 3,
                                }}>
                                <Text style={{ fontSize: 16, fontFamily: 'InterM',color: 'white' }}>{method}</Text>
                            </Pressable>
                        ))}
                    </View>




                    <Text style={{
                        marginTop: 10,
                        color: 'white',
                        fontSize: 20,
                        fontFamily: 'InterM',
                    }}>Hast du Tipps für die nächste Prüfung?</Text>
                    <TextInput
                        value={tips}
                        onChangeText={
                            (text) => {
                                setTips(text);
                            }
                        }
                        style={{
                            fontSize: tips ? 24 : 24,
                            marginTop: 10,
                            width: '100%',
                            padding: 10,
                            borderRadius: 10,
                            color: 'white',
                            backgroundColor: '#1B1F47',
                            fontFamily: 'InterM'
                        }}
                    />
                </View>
            )
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#12142A' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 20 }}>
                    <Pressable onPress={() => navigation.navigate("Subjects", route.params)} style={{paddingBottom:10, paddingTop:15}}>
                        <Ionicons name="arrow-back-outline" size={36} color="white" />
                    </Pressable>
                    <Text style={{
                        color: '#FFB600',
                        fontSize: 40,
                        fontFamily: 'PDBold'
                    }}
                    >Neue Note</Text>
                    <KeyboardAvoidingView>

                        <Text style={{
                            marginTop: 30,
                            color: 'white',
                            fontSize: 20,
                            fontFamily: 'InterM'
                        }}>Name der Prüfung</Text>
                        <TextInput
                            autoFocus={true}
                            value={Name}
                            onChangeText={
                                (text) => {
                                    setName(text);
                                }
                            }
                            style={{
                                fontSize: Name ? 24 : 24,
                                marginTop: 10,
                                width: '100%',
                                padding: 10,
                                borderRadius: 10,
                                color: 'white',
                                backgroundColor: '#1B1F47',
                                fontFamily: 'InterM',
                            }}
                        />

                        <Text style={{
                            marginTop: 10,
                            color: 'white',
                            fontSize: 20,
                            fontFamily: 'InterM'
                        }}>Note</Text>
                        <TextInput
                            keyboardType='numeric'
                            value={GradeV}
                            onChangeText={
                                (text) => {
                                    setGradeV(text);
                                }
                            }
                            style={{
                                fontSize: GradeV ? 24 : 24,
                                marginTop: 10,
                                width: '100%',
                                padding: 10,
                                borderRadius: 10,
                                color: 'white',
                                backgroundColor: '#1B1F47',
                                fontFamily: 'InterM'
                            }}
                        />

                        <Text style={{
                            marginTop: 10,
                            color: 'white',
                            fontSize: 20,
                            fontFamily: 'InterM'
                        }}>Gewichtung</Text>
                        <TextInput
                            keyboardType='numeric'
                            value={Weight}
                            onChangeText={
                                (text) => {
                                    setWeight(text);
                                }
                            }
                            style={{
                                fontSize: Weight ? 24 : 24,
                                marginTop: 10,
                                width: '100%',
                                padding: 10,
                                borderRadius: 10,
                                color: 'white',
                                backgroundColor: '#1B1F47',
                                fontFamily: 'InterM'
                            }}
                        />


                        <Text style={{
                            fontFamily: 'PDSemi',
                            fontSize: 28,
                            marginTop: 20,
                            color: '#FFB600',
                        }}>Weitere Angaben</Text>

                        <View style={{ marginTop: 10, padding: 20, backgroundColor: '#1B1F47', borderRadius: 20}}>
                            <Text style={{fontFamily: 'InterM', fontSize: 20, color: 'white', marginBottom: 10}}>
                                War die Vorbereitung auf diese Prüfung normal oder aussergewöhnlich?
                                </Text>
                            <Text style={{fontFamily: 'InterR', fontSize: 16, color: 'white'}}>
                                Aussergewöhnliche Prüfungen kommen nicht in die Statistiken.{"\n"}{"\n"}
                                Beispiele für Prüfungen mit aussergewöhnlicher Vorbereitung: Mündliche Note, Abschlussprüfung, Vortrag, Singprüfung, zusammengesetzte Note etc.
                                </Text>
                            <Pressable onPress={() => handleSpecial()} style={{
                                backgroundColor: special? '#ff4490': '#FFB600',
                                padding: 5,
                                borderRadius: 5,
                                marginTop: 15,
                                width: 200,
                                alignItems: 'center'
                            }}>
                                <Text style={{fontFamily: 'InterB', fontSize: 16, textAlign: 'center'}}>{specialText}</Text>
                            </Pressable>
                        </View>
                            {displayFurther()}
                        <Pressable
                            onPress={handleGrade}
                            style=
                            {{
                                padding: 10,
                                borderRadius: 10,
                                width: '100%',
                                backgroundColor: '#1B1F47',
                                marginTop: 20,
                                marginBottom: 300,
                            }}>
                            <Text style={{
                                fontSize: 24, textAlign: 'center', color: 'white',
                                fontFamily: 'InterM'
                            }}>Note hinzufügen</Text>
                        </Pressable>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default NewGrade

const styles = StyleSheet.create({})
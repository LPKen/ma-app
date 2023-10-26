import { StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    Alert
} from 'react-native'
import React, { useLayoutEffect, useContext, useEffect, useState } from "react"
import axios from "axios";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const EditSemester = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { semester } = route.params;
    const [newSemester, setNewSemester] = useState("");

    const getSemester = async () => {
        axios
        .get(`https://ma-app.vercel.app/editsemester/${semester}`)
        .then((response) => {
            setNewSemester(response.data[0].name);
        }).catch((error) => {
            console.log("error retrieving semester", error);
        });
    }

    const handleSemester = () => {
        var ipts = [newSemester];
        const allInputsFilled = ipts.every((input) => input.trim() !== '');

        if (allInputsFilled) {
            const Semester = {
                "name": newSemester,
            };
            // send a POST  request to the backend API to register the user
            axios.put(`https://ma-app.vercel.app/semesters/${semester}`, Semester)
                .then((response) => {
                    setNewSemester("");
                    navigation.navigate("Home");
                })
                .catch((error) => {
                    console.log("update failed", error);
                });
            
        } else {
            Alert.alert("Das Semester wurde nicht verändert. 😔",
            "Bitte gib einen Semesternamen an.")
        }
    }

    useEffect(() => {
        getSemester()
        
    }, [semester]);

    useFocusEffect(
        React.useCallback(() => {
        // Fetch data whenever the screen gains focus (e.g., when navigating back)
        getSemester()
        }, [semester])
    );
    return (
        <SafeAreaView style={{flex: 1,backgroundColor: '#12142a'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{padding: 20}}>
                    <Pressable onPress={() => navigation.navigate("Home")} style={{paddingBottom:10, paddingTop:15}}>
                        <Ionicons name="arrow-back-outline" size={36} color="white" />
                    </Pressable>
                    <Text style={{
                        color: '#FFB600',
                        fontSize: 36, 
                        fontFamily: 'PDBold'
                        }}
                        >Semester editieren</Text>
                    <KeyboardAvoidingView>
                        <TextInput
                            autoFocus={true}
                            value={newSemester}
                            onChangeText={(text) => setNewSemester(text)}
                            style={{
                            fontSize: newSemester ? 24 : 24,
                            marginTop: 30,
                            width: '100%',
                            padding: 10,
                            borderRadius: 10,
                            color: 'white',
                            backgroundColor: '#1B1F47',
                            fontFamily: 'InterM'
                            }}
                            placeholderTextColor={"#ffffffaa"}
                            placeholder="Name"
                        />
                        <Pressable onPress={handleSemester} style=
                        {{
                            padding: 10,
                            borderRadius: 10,
                            width: '100%',
                            backgroundColor: '#1B1F47',
                            marginTop: 20,
                        }}>
                            <Text style={{fontSize: 24, textAlign: 'center', fontFamily: 'InterM', color: 'white'}}>Speichern</Text>
                        </Pressable>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditSemester

const styles = StyleSheet.create({})
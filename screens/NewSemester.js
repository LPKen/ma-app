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
import { useState } from 'react'
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const NewSemester = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = route.params;
    const [newSemester, setNewSemester] = useState("");
    const handleSemester = () => {
        var ipts = [newSemester];
        const allInputsFilled = ipts.every((input) => input.trim() !== '');

        if (allInputsFilled) {
            const Semester = {
                "name": newSemester,
                "subjects": [],
                "average": 0.0,
                "pluspoints": 0.0,
                "owner": user,
    
            };
            // send a POST  request to the backend API to register the user
            axios.post("https://ma-app.vercel.app/semesters", Semester)
                .then((response) => {
                    setNewSemester("");
                    navigation.navigate("Home");
                })
                .catch((error) => {
                    console.log("registration failed", error);
                });
            
        } else {
            Alert.alert("Das Semester wurde nicht hinzugefügt. 😔",
            "Bitte gib einen Semesternamen an.")
        }
    }
    return (
        <SafeAreaView style={{flex: 1,backgroundColor: '#12142a'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{padding: 20}}>
                    <Pressable onPress={() => navigation.navigate("Home")} style={{paddingBottom:10, paddingTop:15}}>
                        <Ionicons name="arrow-back-outline" size={36} color="white" />
                    </Pressable>
                    <Text style={{
                        color: '#FFB600',
                        fontSize: 40, 
                        fontFamily: 'PDBold'
                        }}
                        >Neues Semester</Text>
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
                            placeholder="Semestername"
                        />
                        <Pressable onPress={handleSemester} style=
                        {{
                            padding: 10,
                            borderRadius: 10,
                            width: '100%',
                            backgroundColor: '#1B1F47',
                            marginTop: 20,
                        }}>
                            <Text style={{fontSize: 24, textAlign: 'center', fontFamily: 'InterM', color: 'white'}}>Semester hinzufügen</Text>
                        </Pressable>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default NewSemester

const styles = StyleSheet.create({})
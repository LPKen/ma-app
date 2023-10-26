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
//import RNPickerSelect from 'react-native-picker-select';

const NewSubject = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const semId = route.params._id;
    const sname = route.params.name;
    const givenSubjects = [
        "Deutsch","Mathematik","Englisch","Französisch","Geografie","Biologie",
        "Informatik","Physik","Bildnerisches Gestalten","Musik","Chemie","Italienisch",
        "Russisch","Spanisch","Latein","Griechisch","Wirtschaft und Recht","Geschichte",
        "Kunstgeschichte","Sport","Psychologie","Psychologie (PPP)"
    ]
    const newUrl = {semester:{name: sname, semester_id: semId, _id: semId}}
    const [Name, setName] = useState("");
    const [Weight, setWeight] = useState("");
    const [results,setResults] = useState([]);

    const handleSubject = () => {
        var ipts = [Name, Weight];
        const allInputsFilled = ipts.every((input) => input.trim() !== '');

        if (allInputsFilled) {
            const Subject = {
                "name": Name,
                "tests": [],
                "pluspoints": 0.0,
                "average": 0.0,
                "weight": parseFloat(Weight),
                "semester_id": semId,
            };
            if (Subject.weight < 0) {
                Subject.weight = 1;
            }
            // send a POST  request to the backend API to register the user
            axios.post("https://ma-app.vercel.app/subjects", Subject)
                .then((response) => {
                    setName("");
                    setWeight("");
                    navigation.navigate("Semester", route.params);
                })
                .catch((error) => {
                    console.log("registration failed", error);
                });
        } else {
            Alert.alert("Das Fach wurde nicht hinzugefügt. 😔",
            "Bitte gib den Namen und die Gewichtung an.")
        }
    }

    function handleSearch(keyword) {
        setResults([]);
        // Convert the keyword to lowercase for a case-insensitive search
        const lowerKeyword = keyword.toLowerCase();
        
        //fetch groups
        var inclGroup = []
        for (i = 0; i < givenSubjects.length; i++) {
            if(givenSubjects[i].toLowerCase().includes(lowerKeyword)) {
                inclGroup.push(givenSubjects[i]);
            }
        }
        if (lowerKeyword === "") {
            inclGroup = [];
        }
        setResults(inclGroup);

        //make the button darker


      }

    return (
        <SafeAreaView style={{flex: 1,backgroundColor: '#12142A'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{padding: 20}}>
                    <Pressable onPress={() => navigation.navigate("Semester",route.params)} style={{paddingBottom:10, paddingTop:15}}>
                        <Ionicons name="arrow-back-outline" size={36} color="white" />
                    </Pressable>
                    <Text style={{
                        color: '#FFB600',
                        fontSize: 40, 
                        fontFamily: 'PDBold'
                        }}
                        >Neues Fach</Text>
                    <KeyboardAvoidingView>
                        <TextInput
                            autoFocus={true}
                            value={Name}
                            onChangeText={(text) => {
                                setName(text);
                                handleSearch(text);
                            }}
                            style={{
                            fontSize: Name ? 24 : 24,
                            marginTop: 30,
                            width: '100%',
                            padding: 10,
                            borderRadius: 10,
                            color: 'white',
                            backgroundColor: '#1B1F47',
                            fontFamily: 'InterM'
                            }}
                            placeholderTextColor={"#ffffffaa"}
                            placeholder="Name des Fachs"
                        />

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
                            {results.map((post,index) => (
                                <Pressable onPress={() => {
                                    setName(post)
                                    handleSearch("");
                                }} key={Math.random() * 10000000} style={{
                                    padding: 10,
                                    margin: 3,
                                    backgroundColor: '#1B1F47'

                                    }}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: '#ffffff',
                                        fontFamily: 'InterM'
                                    }}>{post}</Text>
                                </Pressable>
                            ))}
                        </View>



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
                            placeholderTextColor={"#ffffffaa"}
                            placeholder="Gewichtung"
                        />
                        <Pressable onPress={handleSubject} style=
                        {{
                            padding: 10,
                            borderRadius: 10,
                            width: '100%',
                            backgroundColor: '#1B1F47',
                            marginTop: 20,
                        }}>
                            <Text style={{fontSize: 24, textAlign: 'center', fontFamily: 'InterM', color: 'white'}}>Fach hinzufügen</Text>
                        </Pressable>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default NewSubject

const styles = StyleSheet.create({})
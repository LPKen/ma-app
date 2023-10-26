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
import React, { useState, useEffect, useContext } from 'react'
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { UserType } from "../UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from "jwt-decode";
import ColorPicker from 'react-native-wheel-color-picker';

const NewGroup = () => {
    const navigation = useNavigation();
    const {userId,setUserId} = useContext(UserType);

    const [Name,setName] = useState("");
    const [color,setColor] = useState("#ffffff");
    const [size,setSize] = useState(50);

    const onColorChange = color => {
        setColor(color);
      };

    const handleGroup = async () => {
        var ipts = [Name, color];
        const allInputsFilled = ipts.every((input) => input.trim() !== '');

        //fetch groups
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId)


        if (allInputsFilled) {
            const Group = {
                name: Name,
                members: [userId],
                admin: userId,
                requests: [],
                pfp: color,
            }

            axios.post("https://ma-app.vercel.app/groups", Group)
                .then((response) => {
                    setName("");
                    setColor("#ffffff");
                    navigation.navigate("Gruppen");
                })
                .catch((error) => {
                    console.log("registration failed", error);
                });

        } else {
            Alert.alert("Die Gruppe wurde nicht erstellt. 😔",
            "Fülle bitte alle Angaben aus.")
        }
    }

    const generateNewSize = () => {
        // range of possible sizes (can possibly be smaller)
        const min = 49;
        const max = 51;

        // ensures new size is different in order to trigger a reload because the state is now different in the size prop
        let newSize = size;
        while (newSize === size) {
        newSize = Math.random() * (max - min) + min;
        }

        setSize(newSize);
    }

    

    return (
        <SafeAreaView style={{flex: 1,backgroundColor: '#12142A'}}>
            <View style={{padding: 20}}>
                <Pressable onPress={() => navigation.navigate("Gruppen")} style={{paddingBottom: 10}}>
                    <Ionicons name="arrow-back-outline" size={36} color="white" />
                </Pressable>
                <Text style={{
                    color: '#FFB600',
                    fontSize: 40,
                    fontFamily: 'PDBold'
                }}>Neue Gruppe</Text>
                <KeyboardAvoidingView>

                <TextInput
                        autoFocus={true}
                        value={Name}
                        onChangeText={(text) => {
                            setName(text);
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
                        placeholder="Name der Gruppe"
                    />
                <View style={{
                    backgroundColor: '#1B1F47',
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 20,
                    marginTop: 10, 
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <View style={{
                        height: 40,
                        width:40,
                        borderRadius: 40,
                        backgroundColor: color,
                        marginRight: 10
                    }}></View>
                    <Text style={{
                        color: color,
                        fontSize: 24,
                        fontFamily: 'InterM'
                    }}>Wähle eine Farbe</Text>
                </View>
                <View style={{marginBottom: 200}}>
                    <ColorPicker
                        color={color}
                        onColorChange={(color) => onColorChange(color)}
                        thumbSize={size}
                        sliderSize={size}
                        noSnap={true}
                        row={false}
                        swatches={false}
                        sliderHidden={true}
                        onInteractionStart={generateNewSize}
                    />
                </View>

                <Pressable onPress={handleGroup} style=
                    {{
                        padding: 10,
                        borderRadius: 10,
                        width: '100%',
                        backgroundColor: '#1B1F47',
                        marginTop: 20,
                    }}>
                    <Text style={{fontSize: 24, textAlign: 'center', fontFamily: 'InterM', color: 'white'}}>Gruppe hinzufügen</Text>
                </Pressable>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    )
}

export default NewGroup

const styles = StyleSheet.create({})
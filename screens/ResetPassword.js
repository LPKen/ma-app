import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useFonts } from 'expo-font';
import jwt_decode from "jwt-decode";
import { Ionicons } from '@expo/vector-icons';

const ResetPassword = () => {
    const navigation = useNavigation();
    const [email,setEmail] = useState("");
    const [loading,setLoading] = useState(false);

    const sendMail = () => {
        setLoading(true);
        axios.post(`https://ma-app.vercel.app/resetpassword/${email}`)
        .then((response) => {
            Alert.alert("Der Code wurde versendet!","Bitte kontrolliere nun deinen E-Mail-Posteingang. Die E-Mail könnte möglicherweise auch in deinem Spam-Ordner gelandet sein.")
            navigation.navigate("Login");
        })
        .catch((error) => {
            console.log("sending failed", error);
        });
    }

    const processLoader = () => {
        if (loading) {
            return <ActivityIndicator style={{marginTop: 30}} color='#FFB600' size="large"/>
        }
      }
    
    useFocusEffect(
        React.useCallback(() => {
        // Fetch data whenever the screen gains focus (e.g., when navigating back)
        setLoading(false);
        }, [])
    );

    return (
        <View style={{flex: 1, backgroundColor: "#12142A"}}>
            <KeyboardAvoidingView>
                <View style={{ padding: 20}}>
                    <Pressable onPress={() => navigation.navigate("Login")} style={{paddingBottom:10, paddingTop:25}}>
                        <Ionicons name="arrow-back-outline" size={36} color="white" />
                    </Pressable>
                    <Text style={{
                        color: '#FFB600',
                        fontSize: 32, 
                        fontFamily: 'PDBold',
                        marginTop: 10
                    }}>
                        Passwort vergessen?
                    </Text>
                    <Text style={{color: 'white',
                    fontSize: 18, 
                    fontWeight: 'medium', 
                    fontFamily: 'InterM',
                    marginTop: 20
                    }}>Bitte gib hier deine E-Mail-Adresse ein, um einen Code zum Einloggen zu erhalten.</Text>
                    <TextInput
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                            }}
                            style={{
                            fontSize: email ? 24 : 24,
                            marginTop: 10,
                            width: '100%',
                            padding: 10,
                            borderRadius: 10,
                            color: 'white',
                            backgroundColor: '#1B1F47',
                            fontFamily: 'InterM'
                            }}
                            placeholderTextColor={"#ffffffaa"}
                            placeholder="E-Mail"
                    />
                    <Pressable 
                        onPress={sendMail}
                            style={{
                                padding: 10,
                                borderRadius: 10,
                                width: '100%',
                                backgroundColor: '#FFB600',
                                marginTop: 30,
                                }}
                            >
                        <Text style={{ fontSize: 24, fontFamily: 'InterB', textAlign: "center"}}>Code senden</Text>
                    </Pressable>
                    {processLoader()}
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default ResetPassword

const styles = StyleSheet.create({})
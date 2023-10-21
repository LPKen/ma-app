import {
    StyleSheet,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    Pressable,
    Alert,
  } from "react-native";
  import React, { useState } from "react";
  import { useNavigation } from "@react-navigation/native";
  import axios from 'axios';
  
const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();

    const handleRegister = () => {

        const user = {
            "name": name,
            "email": email,
            "password": password,
            "pfp": '#ffffff',
        };
        console.log(user);
        // send a POST  request to the backend API to register the user
        axios.post("http://192.168.0.102:8000/register", user)
            .then((response) => {
            console.log(response);
            Alert.alert(
                "Dein Account wurde erfolgreich registriert!",
                "Nun kannst dich nun in deinen Account einloggen."
            );
            setName("");
            setEmail("");
            setPassword("");
            navigation.navigate("Login");
            })
            .catch((error) => {
            Alert.alert(
                "Wir konnten dich leider nicht registrieren.",
                "Bitte kontrolliere, ob du alle Angaben richtig ausgefüllt hast."
            );
            console.log("registration failed", error);
            });
    };


    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#12142A",
        }}
      >
        <KeyboardAvoidingView>
          <View style={{padding: 20}}>
            <Text style={{
                          color: '#FFB600',
                          fontSize: 32, 
                          fontFamily: 'PDBold',
                          marginTop: 50
                      }}>
                          Willkommen bei Scalearn!
            </Text>
    
            <Text style={{color: 'white',
                      fontSize: 28, 
                      fontWeight: 'medium', 
                      fontFamily: 'InterM',
                      marginTop: 10
            }}>Registrieren</Text>
  
            <TextInput
              value={name}
              onChangeText={(text) => {
                  setName(text);
              }}
              style={{
              fontSize: 24,
              marginTop: 20,
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
  
            <TextInput
              value={email}
              onChangeText={(text) => {
                  setEmail(text);
              }}
              style={{
              fontSize: 24,
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
  
            <TextInput
              value={password}
              onChangeText={(text) => {
                  setPassword(text);
              }}
              secureTextEntry={true}
              style={{
              fontSize: 24,
              marginTop: 10,
              width: '100%',
              padding: 10,
              borderRadius: 10,
              color: 'white',
              backgroundColor: '#1B1F47',
              fontFamily: 'InterM'
              }}
              placeholderTextColor={"#ffffffaa"}
              placeholder="Passwort"
            />

            <Pressable
              onPress={handleRegister}
              style={{
                padding: 10,
                        borderRadius: 10,
                        width: '100%',
                        backgroundColor: '#FFB600',
                        marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 24, textAlign: 'center', fontFamily: 'InterB'
                }}
              >
                Account erstellen
              </Text>
            </Pressable>
  
            <Pressable onPress={() => navigation.navigate("Login")} style={{
                        marginTop:20,
                        backgroundColor: '#1B1F47',
                        padding: 10,
                        borderRadius: 10,
                        }}>
                        <Text style={{color: "white", 
                        fontSize: 16, 
                        fontFamily: 'InterM',
                        textAlign: "center"}}>Du hast bereits einen Account? Logge dich hier ein!</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  };
  
  export default RegisterScreen;
  
  const styles = StyleSheet.create({});
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useFonts } from 'expo-font';
import jwt_decode from "jwt-decode";

const LoginScreen = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const navigation = useNavigation();


    useEffect(() => {
        const checkLoginStatus = async() => {
            try {
                const token = await AsyncStorage.getItem("authToken")

                if (token) {
                    const decodedToken = jwt_decode(token);
                    if (decodedToken.exp) {
                        const currentTime = Math.floor(Date.now()/1000);
                        if (decodedToken.exp > currentTime) {
                            navigation.navigate("Tabs");
                        }
                    }
                } 
            } catch (error) {
                console.log("error",error);
            }
        };

        checkLoginStatus();
    },[])
    const handleLogin = () => {
        const user = {
            email: email,
            password: password
        }
        setLoading(true);

        axios.post("https://ma-app.vercel.app/login", user)
            .then((response) => {
            const token = response.data.accessToken;
            AsyncStorage.setItem("authToken",token);
            setEmail("");
            setPassword("");

            navigation.navigate("Tabs");
        }).catch((error) => {
            Alert.alert("Login fehlgeschlagen.","Bitte kontrolliere, ob deine Angaben stimmen.")
            console.log("Login error", error);
        })
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
    

    return (
        <View style={{flex: 1, backgroundColor: "#12142A"}}>
            <KeyboardAvoidingView>
                <View style={{ padding: 20}}>
                    <Text style={{
                        color: '#FFB600',
                        fontSize: 32, 
                        fontFamily: 'PDBold',
                        marginTop: 50
                    }}>
                        Schön, dass du wieder da bist!
                    </Text>
                    <Text style={{color: 'white',
                    fontSize: 28, 
                    fontWeight: 'medium', 
                    fontFamily: 'InterM',
                    marginTop: 20
                    }}>Login</Text>
                    <TextInput
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                            }}
                            style={{
                            fontSize: email ? 24 : 24,
                            marginTop: 30,
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
                            placeholder="Passwort"
                    />



                    <Pressable 
                    onPress={handleLogin}
                        style={{
                            padding: 10,
                            borderRadius: 10,
                            width: '100%',
                            backgroundColor: '#FFB600',
                            marginTop: 50,
                            }}
                        >
                        <Text style={{ fontSize: 24, fontFamily: 'InterB', textAlign: "center"}}>Login</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("Register")} style={{
                        marginTop:20,
                        backgroundColor: '#ff4490',
                        padding: 10,
                        borderRadius: 10,
                        }}>
                        <Text style={{ 
                        fontSize: 16, 
                        fontFamily: 'InterB',
                        textAlign: "center"}}>Du hast noch keinen Account? Hier kannst du einen erstellen!</Text>
                    </Pressable>
                    {processLoader()}
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({

})
import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, ScrollView, ActivityIndicator, Alert } from "react-native";
import React, { useLayoutEffect, useContext, useEffect, useState } from "react"
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { UserType } from "../UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useFonts } from 'expo-font';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const [share, setShare] = useState();
    const [shareText, setShareText] = useState("An");
    const [weight, setWeight] = useState();
    const [weightText, setWeightText] = useState("An");
    const {userId,setUserId} = useContext(UserType);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: "#12142A",
            },
            headerShadowVisible: false,
            headerTitle: "",
            headerLeft: () => (
                <Pressable onPress={() => navigation.navigate("Home")} style={{paddingLeft: 20, paddingBottom: 10}}>
                    <Ionicons name="arrow-back-outline" size={36} color="white" />
                </Pressable>
            ),
        })
    },[])

    const fetchSettings = async() => {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);

        await axios
            .get(`https://ma-app.vercel.app/users/${userId}`)
            .then((response) => {
                if (response.data.shareGrades) {
                    setShareText("An")
                } else {
                    setShareText("Aus")
                }
                if (response.data.propWeight) {
                    setWeightText("An")
                } else {
                    setWeightText("Aus")
                }
                setShare(response.data.shareGrades);
                setWeight(response.data.propWeight);
                setLoading(false);
            })
            .catch((error) => {
                console.log("error retrieving users", error);
            });

    }


    const handleShare = async () => {
        var update = {shareGrades:share, propWeight:weight}
        if (share) {
            setShare(false);
            setShareText("Aus");
            update.shareGrades = false;
        } else {
            setShare(true);
            setShareText("An");
            update.shareGrades = true;
        }

        await axios.put(`https://ma-app.vercel.app/settings/${userId}`,update)
            .then((response) => {
            })
            .catch((error) => {
                console.log("update of pa failed", error);
            });
    }

    const handleWeight = async () => {
        var update = {shareGrades:share, propWeight:weight}
        if (weight) {
            setWeight(false);
            setWeightText("Aus");
            update.propWeight = false;
        } else {
            setWeight(true);
            setWeightText("An");
            update.propWeight = true;
        }

        await axios.put(`https://ma-app.vercel.app/settings/${userId}`,update)
            .then((response) => {
            })
            .catch((error) => {
                console.log("update of pa failed", error);
            });
    }



    useFocusEffect(
        React.useCallback(() => {
        // Fetch data whenever the screen gains focus (e.g., when navigating back)
        setLoading(true);
        fetchSettings();
        }, [])
    );

    const logOut = async () => {
        try {
          // Remove the token from AsyncStorage
          await AsyncStorage.removeItem('authToken');
          // Navigate to your app's log-in or home screen
          navigation.navigate("Login")
        } catch (error) {
          console.error('Error logging out:', error);
        }
      }



    const content = () => {
        if (loading) {
            return <ActivityIndicator style={{marginTop: 200}} color='#FFB600' size="large"/>
        } else {
            return (
                <View style={{padding: 20}}>
                        <Text style={{
                            color: '#FFB600',
                            fontSize: 40, 
                            fontFamily: 'PDBold'
                            }}>Einstellungen</Text>
                        <View style={{ marginTop: 30, padding: 20, backgroundColor: '#1B1F47', borderRadius: 20}}>
                            <Text style={{fontFamily: 'InterM', fontSize: 18, color: 'white'}}>
                            Generell eigene Fächer und Noten mit der Lerngruppe teilen
                                </Text>
                            <Pressable onPress={() => handleShare()} style={{
                                backgroundColor: share? '#FFB600': '#ff4490',
                                padding: 5,
                                borderRadius: 5,
                                marginTop: 15,
                                width: 50,
                                alignItems: 'center'
                            }}>
                                <Text style={{fontFamily: 'InterB', fontSize: 16}}>{shareText}</Text>
                            </Pressable>
                        </View>
                        <View style={{ marginTop: 10, padding: 20, backgroundColor: '#1B1F47', borderRadius: 20}}>
                            <Text style={{fontFamily: 'InterM', fontSize: 18, color: 'white'}}>
                                Anzahl Lerntage und Lernstunden in den Statistiken dem Gewicht der Note anpassen
                                </Text>
                            <Pressable onPress={() => handleWeight()} style={{
                                backgroundColor: weight? '#FFB600': '#ff4490',
                                padding: 5,
                                borderRadius: 5,
                                marginTop: 15,
                                width: 50,
                                alignItems: 'center'
                            }}>
                                <Text style={{fontFamily: 'InterB', fontSize: 16}}>{weightText}</Text>
                            </Pressable>
                        </View>
                        <Pressable onPress={() => navigation.navigate('Account',{user: userId})} style={{
                            backgroundColor: '#1b1f47',
                            padding: 10,
                            borderRadius: 20,
                            marginTop: 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}>
                            <Ionicons name="ios-person-circle-outline" size={28} color="white" />
                            <Text style={{
                                    fontFamily: 'InterB',
                                    fontSize: 20,
                                    color: 'white',
                                    marginLeft: 5,
                                }}>Account</Text>
                        </Pressable>
                        <Pressable onPress={() => logOut()} style={{
                            backgroundColor: '#ff4490',
                            padding: 10,
                            borderRadius: 20,
                            marginTop: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{
                                    fontFamily: 'InterB',
                                    fontSize: 20
                                }}>Abmelden</Text>
                        </Pressable>
                    </View>
            )
        }
    }

    return (
        <SafeAreaView style={{flex: 1,backgroundColor: '#12142A'}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {content()}
                </ScrollView>
        </SafeAreaView>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({})
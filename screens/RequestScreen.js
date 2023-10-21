import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, TextInput } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React,{ useState, useEffect, useLayoutEffect, useContext } from "react";
import { UserType } from "../UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from "jwt-decode";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const RequestScreen = () => {
    const {userId,setUserId} = useContext(UserType);
    const navigation = useNavigation();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: "#12132A",
            },
            headerShadowVisible: false,
            headerTitle: "",
            headerLeft: () => (
                <Pressable onPress={() => navigation.navigate("Gruppen")} style={{paddingLeft: 20, paddingBottom: 10}}>
                    <Ionicons name="arrow-back-outline" size={36} color="white" />
                </Pressable>
            ),
        })
    },[])

    const fetchRequests = async () => {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);

        console.log("Admin",userId);

        await axios.get(`http://192.168.0.102:8000/groups/admin/${userId}`)
            .then((response) => {
                reqCaterer(response.data)
            }).catch((error) => {
                console.log("error retrieving groups", error);
            })


    }

    const reqCaterer = async (req) => {
        var userArray = [];
        for (i = 0; i < req.length; i++) {
            for (j = 0; j < req[i].requests.length; j++) {
                await axios.get(`http://192.168.0.102:8000/users/${req[i].requests[j]}`)
                    .then((response) => {
                        username = response.data.name
                    }).catch((error) => {
                        console.log("error retrieving users", error);
                    });
                var userReq = {
                    group: req[i]._id,
                    group_name:  req[i].name,
                    user: req[i].requests[j],
                    user_name: username
                }
                userArray.push(userReq);
            }
        }
        console.log("userArray:", userArray);
        setRequests(userArray);
        setLoading(false);
    }

    const handleAccept = async (user, group) => {
        axios.post(`http://192.168.0.102:8000/groups/accept/${group}`, {user_id: user})
            .then((response) => {
                console.log(response);
                fetchRequests();
                Alert.alert("Deine Gruppe hat ein neues Mitglied! 🎉");
            })
            .catch((error) => {
                console.log("Aufnahme gescheitert", error);
        });
    }

    const handleReject = async (user, group) => {
        axios.post(`http://192.168.0.102:8000/groups/reject/${group}`, {user_id: user})
            .then((response) => {
                console.log(response);
                fetchRequests();
            })
            .catch((error) => {
                console.log("Ablehnung gescheitert", error);
        });
    }


    useFocusEffect(
        React.useCallback(() => {
        setLoading(true);
        // Fetch data whenever the screen gains focus (e.g., when navigating back)
        fetchRequests();
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

      const content = () => {
        if (loading) {
            return <ActivityIndicator style={{marginTop: 200}} color='#FFB600' size="large"/>
        } else {
            return (
                <View style={{padding: 20}}>
                    <Text style={{
                        color: '#FFB600',
                        fontSize: 40, 
                        fontWeight: 'medium',
                        fontFamily: 'PDBold'
                    }}>Anfragen</Text>
                    {requests.map((post) => (
                        <View key={Math.random()} style={{
                            padding: 20, 
                            borderRadius: 20, 
                            marginTop: 20,
                            backgroundColor: '#1B1F47'
                        }}
                        >
                            <Text style={{
                                color: "#FFB600",
                                fontFamily: 'PDSemi',
                                fontSize: 24,
                            }}>{post.user_name}</Text>
                            <Text style={{
                                color: 'white',
                                fontFamily: 'InterM',
                                fontSize: 16,
                                marginTop: 5,
                            }}>will {post.group_name} beitreten.</Text>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Pressable onPress={() => handleAccept(post.user,post.group)} style={{
                                    backgroundColor: '#FFB600',
                                    padding: 5,
                                    borderRadius: 5,
                                    marginRight: 5,
                                }}>
                                    <Text style={{
                                        fontFamily: 'InterB',
                                        fontSize: 16
                                    }}>Annehmen</Text>
                                </Pressable>
                                <Pressable onPress={() => handleReject(post.user,post.group)} style={{
                                    backgroundColor: '#ff4490',
                                    padding: 5,
                                    borderRadius: 5,
                                    marginRight: 5,
                                    fontFamily: 'InterB'
                                }}>
                                    <Text style={{
                                        fontFamily: 'InterB',
                                        fontSize: 16
                                    }}>Ablehnen</Text>
                                </Pressable>
                            </View>
                        </View>
                    ))}
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

export default RequestScreen

const styles = StyleSheet.create({})
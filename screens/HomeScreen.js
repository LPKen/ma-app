import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, ScrollView, ActivityIndicator, Alert } from "react-native";
import React, { useLayoutEffect, useContext, useEffect, useState } from "react"
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { UserType } from "../UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useFonts } from 'expo-font';


const HomeScreen = () => {
    const [semester, setSemester] = useState([])
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const {userId,setUserId} = useContext(UserType);
    const [users,setUsers] = useState([
        {
            pfp: 'white',
            name: 'User',
        }
    ]);


    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: "#12142A",
            },
            headerShadowVisible: false,
            headerTitle: "",
            headerLeft: () => (
                <View style={{
                    paddingLeft: 20, 
                    paddingBottom: 10, 
                    flexDirection: 'row', 
                    alignItems: 'center'
                }}>
                    <Image
                        style={{
                            width: 120,
                            resizeMode: 'contain',

                        }}
                        source={
                            require('../assets/logo_text.png')
                        }
                    />
                </View>
            ),
            headerRight: () => (
                <Pressable onPress={() => navigation.navigate("Settings")} style={{paddingRight: 20, paddingBottom: 10}}>
                    <Ionicons name="ios-settings-outline" size={28} color="#FFB600" />
                </Pressable>
            ),
        })
    },[])

    const fetchSem = async () => {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);
        axios
            .get(`https://ma-app.vercel.app/semesters/${userId}`)
            .then((response) => {
                setSemester(response.data)
                setLoading(false);
            }).catch((error) => {
                console.log("error retrieving users", error);
            });
    };

        useEffect(() => {
            setLoading(true);
            fetchSem();
            fetchUsers();
            
        }, []);

        useFocusEffect(
            React.useCallback(() => {
            // Fetch data whenever the screen gains focus (e.g., when navigating back)
            setLoading(true);
            fetchSem();
            fetchUsers();
            }, [])
        );

    const fetchUsers = async () => {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);

        axios
            .get(`https://ma-app.vercel.app/users/${userId}`)
            .then((response) => {
            setUsers(response.data);
            })
            .catch((error) => {
                console.log("error retrieving users", error);
            });
    };

    const handleDelete = (id) => {
        // alert function asking to delete
        Alert.alert(
            'Willst du dieses Semester wirklich löschen?',
            'Alle darin enthaltenen Fächer und Noten werden auch gelöscht.',
            [
              {
                text: 'Nein',
              },
              {
                text: 'Ja',
                onPress: () => {
                  //delete semester
                axios
                    .delete(`https://ma-app.vercel.app/semesters/${id}`)
                    .then((response) => {
                        fetchSem();
                        console.log(response);
                    })
                    .catch((error) => {
                        console.log("error deleting semester", error);
                    })
                
                axios
                    .get(`https://ma-app.vercel.app/subjects/${id}`)
                    .then((response) => {
                        const subId = response.data;
                        deleteGrades(subId);
                    }).catch((error) => {
                        console.log("error retrieving semester", error);
                    });
                
                //this one mustn't run before the one above    
                axios
                    .delete(`https://ma-app.vercel.app/subjects/${id}`)
                    .then((response) => {
                    })
                    .catch((error) => {
                        console.log("error deleting subject", error);
                    })
                },
              },
            ],
            { cancelable: false }
        );
    }

    const deleteGrades = (id) => {
        for (i = 0; i < id.length; i++) {
            axios
                .delete(`https://ma-app.vercel.app/grades/${id[i]._id}`)
                .then((response) => {
                })
                .catch((error) => {
                    console.log("error deleting grade", error);
                })
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
                                }}>Hallo, {users.name}</Text>
                            <View style={{
                                height: 40,
                                width:40,
                                borderRadius: 40,
                                backgroundColor: users.pfp,
                                marginTop: 5,
                                marginBottom: 20
                                }}></View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{color: 'white',fontSize: 32, fontWeight: 'medium', fontFamily: 'InterM'}}>Semester</Text>
                                <Pressable onPress={() => navigation.navigate("NewSemester", {user: userId})}style={{ 
                                    marginLeft: 10, 
                                    textAlign: 'center',
                                    borderRadius: 5
                                    }}>
                                    <Ionicons name="add-circle-outline" size={32} color='#FFB600' />
                                </Pressable>
                            </View>
                            {semester.map((post) => (
                            <Pressable key={Math.random() * 10000000} onPress={() => navigation.navigate("Semester", { name: post.name, _id: post._id})} style={{
                                padding: 20, 
                                borderRadius: 20, 
                                marginTop: 20,
                                backgroundColor: '#1B1F47'
        
                                }}>
                                <View style={{
                                    flexDirection:'row', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 5
                                }}>
                                    <Text style={{
                                        fontSize: 24,
                                        color: '#FFB600',
                                        fontFamily: 'PDSemi',
                                    }}>{post.name}</Text>
                                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                                        <Pressable onPress={() => navigation.navigate("EditSemester", {semester: post._id})}>
                                            <Ionicons name="ios-create-outline" size={26} color='#FFB600' />
                                        </Pressable>
                                        <Pressable style={{marginLeft: 15}} onPress={() => handleDelete(post._id)}>
                                            <Ionicons name="ios-trash-outline" size={26} color='#FFB600' />
                                        </Pressable>
                                    </View>
                                </View>
                                <View style={{marginTop: 5}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#242853', padding: 10, borderRadius: 10, marginBottom: 5}}>
                                        <Text style={{fontSize: 16, fontFamily: 'InterB', color: 'white'}}>Notenschnitt</Text>
                                        <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>{post.average}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#242853', padding: 10, borderRadius: 10, marginBottom: 5}}>
                                        <Text style={{fontSize: 16, fontFamily: 'InterB', color: 'white'}}>Pluspunkte</Text>
                                        <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>{post.pluspoints}</Text>
                                    </View>
                                </View>
                            </Pressable>
                            ))}
                        </View>
            )
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
    return (
        <SafeAreaView style={{flex: 1,backgroundColor: '#12142A'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {content()}
            </ScrollView>
        </SafeAreaView>
    )
    
    

}

export default HomeScreen

const styles = StyleSheet.create({})
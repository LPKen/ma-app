import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, TextInput } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React,{ useState, useEffect, useLayoutEffect, useContext } from "react";
import { UserType } from "../UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from "jwt-decode";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';


const GroupSearch = () => {
    const [term, setTerm] = useState("");
    const [groups, setGroups] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const {userId,setUserId} = useContext(UserType);

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: "#12142A",
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

    const handleSearch = async (keyword) => {
        setResults([]);
        // Convert the keyword to lowercase for a case-insensitive search
        const lowerKeyword = keyword.toLowerCase();
        console.log(lowerKeyword);
        
        //fetch groups
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);

        axios
        .get(`http://192.168.0.102:8000/groups/search/${userId}`)
            .then((response) => {
                setGroups(response.data)
                setLoading(false);
            }).catch((error) => {
                console.log("error retrieving groups", error);
            });
        // Use the filter method to search for items that contain the keyword
        var inclGroup = []
        for (i = 0; i < groups.length; i++) {
            if(groups[i].name.toLowerCase().includes(lowerKeyword)) {
                console.log(groups[i].name)
                inclGroup.push(groups[i]);
            }
        }
        if (lowerKeyword === "") {
            inclGroup = [];
        }
        setResults(inclGroup);
        console.log("Res",results);
      }

    const handleRequest = async (groupId) => {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);
        console.log("Gruppe",groupId);

        axios.post(`http://192.168.0.102:8000/groups/${groupId}`, {user_id: userId})
            .then((response) => {
                navigation.navigate("Gruppen");
                Alert.alert("Anfrage versendet!. 🎉",
                "Der Gruppenadmin kann jetzt über deine Aufnahme entscheiden.")
            })
            .catch((error) => {
                console.log("anfrage gescheitert", error);
            });
    }
    
    useEffect(() => {
        setTerm("");
        setLoading(true);
        handleSearch("");
        
    }, []);

    useFocusEffect(
        React.useCallback(() => {
        // Fetch data whenever the screen gains focus (e.g., when navigating back)
        setTerm("");
        setLoading(true);
        handleSearch("");
        }, [])
    );

    const content = () => {
        if (loading) {
            return <ActivityIndicator style={{marginTop: 200}} color='#FFB600' size="large"/>
        } else {
            return (
                <View style={{padding: 20}}>
                    <KeyboardAvoidingView>
                        <TextInput
                            autoFocus={true}
                            value={term}
                            onChangeText={
                                (text) => {
                                    setTerm(text);
                                    handleSearch(text);
                                }
                            }
                            style={{
                            fontSize: term ? 24 : 24,
                            width: '100%',
                            padding: 10,
                            borderRadius: 20,
                            color: '#FFB600',
                            backgroundColor: '#1B1F47',
                            fontFamily: 'PDSemi'
                            }}
                            placeholderTextColor={"#FFFFFFAA"}
                            placeholder="Gruppe suchen"
                        />
                    </KeyboardAvoidingView>
                    <Text style={{fontSize: 36, color: 'white', marginTop: 30, fontFamily: 'InterM'}}>Suchresultate</Text>
                    {results.map((post,index) => (
                        <Pressable key={Math.random() * 10000000} style={{
                            padding: 20, 
                            borderRadius: 20, 
                            marginTop: 10,
                            backgroundColor: '#1B1F47'

                            }}>
                            <View style={{flexDirection: 'row', alignItems: 'center',flexWrap:'wrap'}}>
                                <Text style={{
                                    fontSize: 24,
                                    color: '#FFB600',
                                    fontFamily: 'PDSemi'
                                }}>{post.name}</Text>
                            </View>
                            <View style={{marginTop: 5}}>
                                <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>Anzahl Mitglieder: {post.members.length}</Text>
                            </View>
                            <View>
                                <Pressable onPress={() => handleRequest(post._id)} style={{
                                    backgroundColor:'white', 
                                    borderRadius: 10, 
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 10,
                                    marginTop: 10,
                                    }}>
                                    <Text>Beitrittsanfrage senden</Text>
                                </Pressable>
                            </View>
                        </Pressable>
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

export default GroupSearch

const styles = StyleSheet.create({})
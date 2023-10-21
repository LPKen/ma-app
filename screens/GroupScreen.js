import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, ActivityIndicator, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React,{ useState, useEffect, useContext } from "react";
import { UserType } from "../UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const GroupScreen = () => {
  const [group,setGroup] = useState([]);
  const navigation = useNavigation();
  const {userId,setUserId} = useContext(UserType);
  const [loading, setLoading] = useState(true);
  const [requestNum, setRequestNum] = useState(0);


  useEffect(() => {
    setLoading(true);
    fetchGroups()
    fetchRequests()
    
}, []);

useFocusEffect(
    React.useCallback(() => {
    // Fetch data whenever the screen gains focus (e.g., when navigating back)
    setLoading(true);
    fetchGroups()
    fetchRequests()
    }, [])
);

    const fetchGroups = async () => {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);
        console.log("GruppenUser",userId);
        await axios
        .get(`http://192.168.0.102:8000/groups/${userId}`)
            .then((response) => {
                setGroup(response.data)
                setLoading(false);
            }).catch((error) => {
                console.log("error retrieving groups", error);
            });
        };
    
    const fetchRequests = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      
      await axios.get(`http://192.168.0.102:8000/groups/admin/${userId}`)
          .then((response) => {
              reqCaterer(response.data)
          }).catch((error) => {
              console.log("error retrieving groups", error);
          })


    }
  
    const reqCaterer = async (req) => {
        var numOfRequests = 0;
        for (i = 0; i < req.length; i++) {
            for (j = 0; j < req[i].requests.length; j++) {
                numOfRequests++
            }
        }
        console.log("Anzahl", numOfRequests);
        setRequestNum(numOfRequests);
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

  const content = () => {
    if (loading) {
        return <ActivityIndicator style={{marginTop: 200}} color='#FFB600' size="large"/>
    } else {
        return (
          <View style={{padding: 20}}>
            <Pressable onPress={() => navigation.navigate("Requests")} style={{
              flexDirection:'row', 
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10, 
              marginBottom: 15,
              marginTop: 15,
              padding: 10,
              borderRadius: 10,
              backgroundColor: '#1B1F47',
              width: 140
              }}>
            <Text style={{marginRight: 10, fontSize: 16, color: 'white', fontWeight: 400}}>Anfragen</Text>
            <View style={{height: 24, width: 24, borderRadius: 24, backgroundColor: '#FFB600',alignItems:"center",justifyContent: 'center'}}>
              <Text>{requestNum}</Text>
            </View>
          </Pressable>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: "#FFB600",fontSize: 40, fontFamily: 'PDBold'}}>Gruppen</Text>
            <Pressable onPress={() => navigation.navigate("NewGroup")} style={{ 
                marginLeft: 10, 
                textAlign: 'center',
                borderRadius: 5
                }}>
                <Ionicons name="add-circle-outline" size={40} color='#FFB600' />
            </Pressable>
          </View>

          <Pressable onPress={() => navigation.navigate("GroupSearch")} style={{
            backgroundColor: '#1B1F47',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderRadius: 30,
            marginTop: 20
            }}>
              <Ionicons name="ios-search" size={24} color="#FFB600" />
              <Text style={{marginLeft: 10, fontSize: 16, fontFamily: 'InterM', color: 'white'}}>Eine neue Gruppe suchen...</Text>
          </Pressable>
          {group.map((post) => (
            <Pressable onPress={() => navigation.navigate("GroupSubjects",{_id: post._id, name: post.name})} key={Math.random() * 10000000} style={{
                backgroundColor: '#1B1F47',
                borderRadius: 20, 
                marginTop: 20,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center'

                }}>
                <View style={{
                    height: 40,
                    width:40,
                    borderRadius: 40,
                    backgroundColor: post.pfp,
                }}></View>
                <Text key={post.name} style={{
                    marginLeft: 10,
                    paddingRight: 50,
                    fontSize: 24,
                    fontFamily: 'PDSemi',
                    fontWeight: 'medium',
                    color: 'white',
                }}>{post.name}</Text>
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

export default GroupScreen;

const styles = StyleSheet.create({
});

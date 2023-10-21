import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, TextInput } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React,{ useState, useEffect, useLayoutEffect, useContext } from "react";
import { UserType } from "../UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from "jwt-decode";
import axios, { all } from "axios";
import { Ionicons } from '@expo/vector-icons';

const GroupMembers = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const group = route.params;
  const [loading,setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const {userId,setUserId} = useContext(UserType);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPfp, setUserPfp] = useState("");

  const fetchMembers = async (group) => {
    await axios
    .get(`http://192.168.0.102:8000/groups/users/${group}`)
        .then((response) => {
            findUsers(response.data[0].members)
        }).catch((error) => {
            console.log("error retrieving users", error);
    });
  }

  const findUsers = async (users) => {
    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    setUserId(userId);

    let userArray = [];
    for (i = 0; i < users.length; i++) {
      await axios
            .get(`http://192.168.0.102:8000/users/${users[i]}`)
            .then((response) => {
              if (response.data._id != userId) {
                userArray.push(response.data);
              } else {
                setUserPfp(response.data.pfp);
              }
            })
            .catch((error) => {
                console.log("error retrieving users", error);
            });
    }
    setMembers(userArray);
    setLoading(false);
  }


  useFocusEffect(
    React.useCallback(() => {
    // Fetch data whenever the screen gains focus (e.g., when navigating back)
    setLoading(true);
    setIsAdmin(false);
    fetchMembers(group._id);
    getAdmin(group._id);
    }, [group])
  );

  const getAdmin = async (group) => {

    await axios.get(`http://192.168.0.102:8000/groups/gadmin/${group}`)
            .then((response) => {
              if (userId === response.data[0].admin) {
                setIsAdmin(true);
              }
            }).catch((error) => {
                console.log("error retrieving groups", error);
            })
  }

  const leaveAlert = (user) => {
    if (user == userId) {
      Alert.alert(
        'Willst du wirklich die Gruppe verlassen?',
        'Für einen Wiederbeitritt wäre eine Anfrage nötig.',
        [
          {
            text: 'Nein',
          },
          {
            text: 'Ja',
            onPress: () => {
              leave(user);
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        'Willst du dieses Mitglied wirklich entfernen?',
        'Das Mitglied könnte nur durch eine Anfrage wieder beitreten.',
        [
          {
            text: 'Nein',
          },
          {
            text: 'Ja',
            onPress: () => {
              leave(user);
            },
          },
        ],
        { cancelable: false }
      );
    }
  }

  const leave = async (j) => {
    console.log(group);
    await axios.post(`http://192.168.0.102:8000/groups/leave/${group._id}`, {user_id: j})
        .then((response) => {
            console.log(response);
            if (j == userId) {
              checkAdmin();
              navigation.navigate("Gruppen");
            } else {
              setLoading(true);
              fetchMembers(group._id);
            }
        })
        .catch((error) => {
            console.log("Ablehnung gescheitert", error);
    });
}

  const checkAdmin = async () => {
  if (isAdmin) {
      if (members[0] != undefined) {
        const newAdmin = {admin: members[0]._id}
        await axios.put(`http://192.168.0.102:8000/groups/newAdmin/${group._id}`, newAdmin)
          .then((response) => {
              console.log(response);
          })
          .catch((error) => {
              console.log("Ablehnung gescheitert", error);
        });
      } else {
        await axios
        .delete(`http://192.168.0.102:8000/groups/${group._id}`)
        .then((response) => {
            navigation.navigate("Gruppen");
        })
        .catch((error) => {
            console.log("error deleting semester", error);
        })
      }
    }
  }

  const handleDelete = (id) => {
    // alert function asking to delete
    Alert.alert(
        'Willst du diese Gruppe wirklich löschen?',
        'Die Gruppe wäre unwiderruflich gelöscht.',
        [
          {
            text: 'Nein',
          },
          {
            text: 'Ja',
            onPress: () => {
              //delete semester
            axios
                .delete(`http://192.168.0.102:8000/groups/${id}`)
                .then((response) => {
                    navigation.navigate("Gruppen");
                })
                .catch((error) => {
                    console.log("error deleting semester", error);
                })
            
            },
          },
        ],
        { cancelable: false }
    );
}


  const content = () => {
    if (loading) {
        return <ActivityIndicator style={{marginTop: 200}} color='#FFB600' size="large"/>
    } else if (isAdmin) {
        return (
          <View>
            <Text style={{
                        color: '#FFB600',
                        fontSize: 40, 
                        fontWeight: 'medium',
                        fontFamily: 'PDBold'
                    }}>Mitglieder</Text>
            <View style={{
                  flex: 1,
                  backgroundColor: '#1B1F47',
                  padding: 20,
                  borderRadius: 20,
                  marginTop: 20,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <View style={{
                  height: 40,
                  width:40,
                  borderRadius: 40,
                  backgroundColor: userPfp,
                  }}></View>
                  <Text style={{
                      marginLeft: 20,
                      fontSize: 24,
                      fontFamily: 'PDSemi',
                      fontWeight: 'medium',
                      color: 'white',
                  }}>Du (Admin)</Text>
            </View>
            {members.map((post) => (
                <View key={post._id} style={{
                  flex: 1,
                  backgroundColor: '#1B1F47',
                  padding: 20,
                  borderRadius: 20,
                  marginTop: 20,
                }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <View key={post.pfp} style={{
                    height: 40,
                    width:40,
                    borderRadius: 40,
                    backgroundColor: post.pfp,
                    }}></View>
                    <Text key={post.name} style={{
                        marginLeft: 20,
                        fontSize: 24,
                        fontFamily: 'PDSemi',
                        fontWeight: 'medium',
                        color: 'white',
                    }}>{post.name}</Text>
                  </View>
                  <Pressable onPress={() => leaveAlert(post._id)} style={{
                    backgroundColor: '#ff4490',
                    padding: 5,
                    borderRadius: 10,
                    marginTop: 20,
                  }}>
                    <Text style={{
                        fontFamily: 'InterB',
                        fontSize: 16,
                        textAlign: 'center'
                    }}>Entfernen</Text>
                  </Pressable>
                </View>
              ))}
              <Pressable onPress={() => navigation.navigate("EditGroup", {group: group._id})} style={{
                backgroundColor: '#1b1f47',
                padding: 10,
                borderRadius: 20,
                marginTop: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{
                        fontFamily: 'InterB',
                        fontSize: 20,
                        color: 'white'
                    }}>Gruppe bearbeiten</Text>
              </Pressable>
              <Pressable onPress={() => leaveAlert(userId)} style={{
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
                    }}>Gruppe verlassen</Text>
              </Pressable>
              <Pressable onPress={() => handleDelete(group._id)} style={{
                backgroundColor: '#1b1f47',
                padding: 10,
                borderRadius: 20,
                marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{
                        fontFamily: 'InterB',
                        fontSize: 20,
                        color: '#ff4490'
                    }}>Gruppe löschen</Text>
              </Pressable>
          </View>
        )
    } else {
      return (
        <View>
          <Text style={{
                    color: '#FFB600',
                    fontSize: 40, 
                    fontWeight: 'medium',
                    fontFamily: 'PDBold'
                }}>Mitglieder</Text>
            <View style={{
                  flex: 1,
                  backgroundColor: '#1B1F47',
                  padding: 20,
                  borderRadius: 20,
                  marginTop: 20,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <View style={{
                  height: 40,
                  width:40,
                  borderRadius: 40,
                  backgroundColor: userPfp,
                  }}></View>
                  <Text style={{
                      marginLeft: 20,
                      fontSize: 24,
                      fontFamily: 'PDSemi',
                      fontWeight: 'medium',
                      color: 'white',
                  }}>Du</Text>
            </View>
        {members.map((post) => (
            <View key={post._id} style={{
              flex: 1,
              backgroundColor: '#1B1F47',
              padding: 20,
              borderRadius: 20,
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <View key={post.pfp} style={{
              height: 40,
              width:40,
              borderRadius: 40,
              backgroundColor: post.pfp,
              }}></View>
              <Text key={post.name} style={{
                  marginLeft: 20,
                  fontSize: 24,
                  fontFamily: 'PDSemi',
                  fontWeight: 'medium',
                  color: 'white',
              }}>{post.name}</Text>
          </View>
          ))}
          <Pressable onPress={() => leaveAlert(userId)} style={{
                backgroundColor: '#ff4490',
                padding: 10,
                borderRadius: 20,
                marginTop: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{
                        fontFamily: 'InterB',
                        fontSize: 20
                    }}>Gruppe verlassen</Text>
          </Pressable>
      </View>
      )
    }
  }

  return (
    <SafeAreaView style={{flex: 1,backgroundColor: '#12142A'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{padding: 20}}>
                    <Pressable onPress={() => navigation.navigate("GroupSubjects", group)} style={{paddingBottom:10, paddingTop:15}}>
                        <Ionicons name="arrow-back-outline" size={36} color="white" />
                    </Pressable>  
                    {content()}
                </View>
            </ScrollView>
        </SafeAreaView>
  )
}


export default GroupMembers

const styles = StyleSheet.create({})
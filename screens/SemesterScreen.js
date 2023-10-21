import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, ScrollView, Alert, ActivityIndicator} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const SemesterScreen = () => {
    const [subjects,setSubjects] = useState([]);
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const [shared, setShared] = useState([]);
    const [shareText, setShareText] = useState([]);

    //we get the entire information about the semester
    const semester = route.params;
    console.log("RP",semester);
    //encodeURIComponent(term);
    const navigation = useNavigation();

    const fetchSub = async () => {
        var sharedSubs = [];
        var sharedTexts = [];
        axios
            .get(`http://192.168.0.102:8000/subjects/${semester._id}`)
            .then((response) => {
                setSubjects(response.data)
                calcPA(response.data)
                setLoading(false);
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].shared) {
                        sharedTexts.push("Mit Gruppen geteilt")
                    } else {
                        sharedTexts.push("Nur für dich sichtbar")
                    }
                    sharedSubs.push(response.data[i].shared);
                }
                setShared(sharedSubs);
                setShareText(sharedTexts);

            }).catch((error) => {
                console.log("error retrieving subs man", error);
            });
    };

    const updateSem = async (update) => {
        axios.put(`http://192.168.0.102:8000/semester/${semester._id}`, update)
            .then((response) => {
            })
            .catch((error) => {
                console.log("update of pa failed", error);
            });
    }

    const updateShared = async (index) => {
        var update = {shared:shared[index]}
        if (shared[index]) {
            update.shared = false;
        } else {
            update.shared = true;
        }

        axios.put(`http://192.168.0.102:8000/sharesubjects/${subjects[index]._id}`, update)
        .then((response) => {
            console.log(response.data);
            fetchSub();
        })
        .catch((error) => {
            console.log("update of pa failed", error);
        });  
    }

    const calcPA = (data) => {
        if (data.length > 0) {
            //calculate average
            var average = 0;
            var numOfSubjects = 0;
            var pluspoints = 0;
            for (let i = 0; i < data.length; i++) {
                average += data[i].average * data[i].weight;
                if (data[i].average != 0) {
                    numOfSubjects += data[i].weight;
                }
                pluspoints += data[i].pluspoints * data[i].weight;
            }
            if (average != 0) {
                average = Math.round(average / numOfSubjects * 100)/100;
            }
            var pa = {
                "pluspoints": pluspoints,
                "average": average,
            }
        }
        else {
            var pa = {
                "pluspoints": 0,
                "average": 0,
            }
        }
        updateSem(pa);
        return pa;
    }

    const handleDelete = (id) => {
        // alert function asking to delete
        Alert.alert(
            'Willst du dieses Fach wirklich löschen?',
            'Alle darin enthaltenen Noten werden auch gelöscht.',
            [
              {
                text: 'Nein',
              },
              {
                text: 'Ja',
                onPress: () => {
                axios
                    .delete(`http://192.168.0.102:8000/deletesubjects/${id}`)
                    .then((response) => {
                        fetchSub();
                    })
                    .catch((error) => {
                        console.log("error deleting subject", error);
                    })
                

                axios
                    .delete(`http://192.168.0.102:8000/grades/${id}`)
                    .then((response) => {
                    })
                    .catch((error) => {
                        console.log("error deleting grade", error);
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
        } else {
            return (
                <View style={{padding: 20}}>
                <Pressable onPress={() => navigation.navigate("Home")} style={{paddingBottom:10,paddingTop:15}}>
                    <Ionicons name="arrow-back-outline" size={36} color="white" />
                </Pressable>
                    <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
                        <Text style={{
                            color: '#FFB600',
                            fontSize: 40, 
                            fontWeight: 'medium', 
                            fontFamily: 'PDBold'
                            }}>{semester.name}</Text>
                            <Pressable onPress={() => navigation.navigate("NewSubject", {name: semester.name, _id: semester._id})}style={{
                                    marginLeft: 10, 
                                    textAlign: 'center',
                                    borderRadius: 5
                                    }}>
                                    <Ionicons name="add-circle-outline" size={40} color="#FFB600" />
                            </Pressable>
                    </View>
                    {subjects.map((post,index) => (
                    <Pressable key={Math.random() * 10000000} onPress={() => navigation.navigate("Subjects", { sub_id: post._id, sub_name: post.name, name: semester.name, _id: semester._id })} style={{
                        backgroundColor: '#1B1F47',
                        padding: 20, 
                        borderRadius: 20, 
                        marginTop: 20,

                        }}>
                        <Pressable onPress={() => updateShared(index)} style={{
                                backgroundColor: shared[index]? '#FFB600': '#ff4490',
                                padding: 5,
                                borderRadius: 5,
                                width: 200,
                                alignItems: 'center'
                        }}>
                            <Text style={{fontFamily: 'InterB', fontSize: 16}}>{shareText[index]}</Text>
                        </Pressable>
                        <Text style={{
                            fontSize: 24,
                            marginTop: 15,
                            color: '#FFB600',
                            fontFamily: 'PDSemi'
                        }}>{post.name}</Text>
                        <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>Pluspunkte: {post.pluspoints}</Text>
                        <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>Notenschnitt: {post.average}</Text>
                        <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>Gewichtung: {post.weight}</Text>
                        <View style={{flexDirection:'row', marginTop: 10}}>
                        <Pressable onPress={() => navigation.navigate("EditSubject", {subject: post._id, name: semester.name, _id: semester._id})}>
                                <Ionicons name="ios-create-outline" size={26} color='#FFB600' />
                            </Pressable>
                            <Pressable style={{marginLeft: 15}} onPress={() => handleDelete(post._id)}>
                                <Ionicons name="ios-trash-outline" size={26} color='#FFB600' />
                            </Pressable>
                        </View>
                    </Pressable>
                    ))}
                </View>
            )
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchSub();
    }, [semester.name]);

    useFocusEffect(
        React.useCallback(() => {
          // Fetch data whenever the screen gains focus (e.g., when navigating back)
          setLoading(true);
          fetchSub();
        }, [semester.name])
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
        <SafeAreaView style={{flex: 1,backgroundColor: '#12142A'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {content()}
            </ScrollView>
        </SafeAreaView>
    )
}

export default SemesterScreen

const styles = StyleSheet.create({})
import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const SubjectScreen = () => {
    const [grade,setGrade] = useState([]);
    const [share, setShare] = useState();
    const [shareText, setShareText] = useState("Mit Gruppe geteilt");
    const route = useRoute();

    //we get the entire information about the subject
    const subject = route.params;
    console.log("RPP", route.params);
    const semName = route.params.name;
    const [loading, setLoading] = useState(true);
    const newUrl = {semester:{semester_id: subject._id, name: semName}}
    //encodeURIComponent(term);
    const navigation = useNavigation();

    const fetchSub = async () => {
        axios
            .get(`http://192.168.0.102:8000/grades/${subject.sub_id}`)
            .then((response) => {
                setGrade(response.data)
                calcPA(response.data);
                setLoading(false);
            }).catch((error) => {
                console.log("error retrieving users", error);
            });
    };

    const updateSub = async (update) => {
        axios.put(`http://192.168.0.102:8000/subjects/${subject.sub_id}`, update)
            .then((response) => {
            })
            .catch((error) => {
                console.log("update of pa failed", error);
            });
    }


    const calcPA = (data) => {
        if (data.length > 0) {
            //calculate average
            var average = 0;
            var numOfTests = 0;
            for (let i = 0; i < data.length; i++) {
                average += data[i].grade * data[i].weight;
                numOfTests += data[i].weight;
            }
            average = Math.round(average / numOfTests * 100)/100;
            //calculate pluspoints
            var pluspoints = Math.round(average * 2)/2 - 4;
            if (pluspoints < 0) {
                pluspoints *= 2
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
        updateSub(pa);
        return pa;
    }

    useEffect(() => {
        setLoading(true);
        fetchSub();
    }, [subject.sub_id]);

    useFocusEffect(
        React.useCallback(() => {
          // Fetch data whenever the screen gains focus (e.g., when navigating back)
          setLoading(true);
          fetchSub();
        }, [subject.sub_id])
      );

    const handleDelete = (id) => {
        // alert function asking to delete
        Alert.alert(
            'Willst du diese Note wirklich löschen?',
            'Die Note lässt sich danach nicht wiederherstellen.',
            [
              {
                text: 'Nein',
              },
              {
                text: 'Ja',
                onPress: () => {

                axios
                    .delete(`http://192.168.0.102:8000/deletegrades/${id}`)
                    .then((response) => {
                        fetchSub();
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
                <Pressable onPress={() => navigation.navigate("Semester",route.params)} style={{paddingBottom:10, paddingTop:15}}>
                    <Ionicons name="arrow-back-outline" size={36} color="white" />
                </Pressable>
                <View style={{flexDirection: 'row',alignItems: 'center'}}>
                    <Text style={{color: '#FFB600',fontSize: 40, fontFamily: 'PDBold' }}>{subject.sub_name}</Text>
                        <Pressable onPress={() => navigation.navigate("NewGrade", subject)}style={{
                                marginLeft: 10, 
                                textAlign: 'center',
                                borderRadius: 5
                                }}>
                                <Ionicons name="add-circle-outline" size={40} color="#FFB600" />
                            </Pressable>
                </View>
                {grade.map((post,index) => (
                <Pressable key={Math.random()} style={{
                    backgroundColor: '#1B1F47',
                    padding: 20, 
                    borderRadius: 20, 
                    marginTop: 20,

                    }}>
                    <Text style={{
                        fontSize: 24,
                        fontFamily: 'PDSemi',
                        color: '#FFB600'
                    }}>{post.name}</Text>
                    <Text style={{marginTop: 7, fontSize: 16, fontFamily: 'InterM', color: 'white'}}>Note: {post.grade}</Text>
                    <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>Gewichtung: {post.weight}</Text>
                    <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>Lernmethoden:</Text>
                        <View>
                                {post.methods.map((content,index) => (
                                    <Text key={index} style={{ 
                                    fontFamily: 'PDSemi',
                                    fontSize: 16,
                                    color: '#FFB600',
                                    }}>- {content}</Text>
                                ))}
                            </View>
                    <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>Anzahl Lerntage: {post.days}</Text>
                    <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>Anzahl Lernstunden: {post.hours}</Text>
                    <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>Tipps: {post.tips}</Text>
                    <View style={{flexDirection:'row', marginTop: 10}}>
                            <Pressable onPress={() => handleDelete(post._id)}>
                                <Ionicons name="ios-trash-outline" size={26} color='#FFB600' />
                            </Pressable>
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
        <SafeAreaView style={{flex: 1,backgroundColor: '#12142a'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {content()}
            </ScrollView>
        </SafeAreaView>
    )
}

export default SubjectScreen

const styles = StyleSheet.create({})
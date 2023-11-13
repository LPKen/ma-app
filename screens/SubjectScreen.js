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
    const semName = route.params.name;
    const [loading, setLoading] = useState(true);
    const newUrl = {semester:{semester_id: subject._id, name: semName}}
    //encodeURIComponent(term);
    const navigation = useNavigation();
    const [subjectStats, setSubjectStats] = useState({});

    const fetchSub = async () => {
        axios
            .get(`https://ma-app.vercel.app/grades/${subject.sub_id}`)
            .then((response) => {
                setGrade(response.data)
                calcPA(response.data);
                setLoading(false);
            }).catch((error) => {
                console.log("error retrieving users", error);
            });
    };

    const updateSub = async (update) => {
        axios.put(`https://ma-app.vercel.app/subjects/${subject.sub_id}`, update)
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
        setSubjectStats(pa);
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
                    .delete(`https://ma-app.vercel.app/deletegrades/${id}`)
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
    <View style={{backgroundColor: '#1b1f47', padding: 20, borderRadius: 20, marginBottom: 30}}>
        <Text style={{
            color: '#FFB600',
            fontSize: 32, 
            fontWeight: 'medium', 
            fontFamily: 'PDBold',
            marginBottom: 15,
            }}>{subject.sub_name}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#242853', padding: 10, borderRadius: 10, marginBottom: 5}}>
            <Text style={{fontSize: 19, fontFamily: 'InterB', color: 'white'}}>Pluspunkte</Text>
            <Text style={{fontSize: 19, fontFamily: 'InterB', color: 'white'}}>{subjectStats.pluspoints}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#242853', padding: 10, borderRadius: 10, marginBottom: 5}}>
            <Text style={{fontSize: 19, fontFamily: 'InterB', color: 'white'}}>Notenschnitt</Text>
            <Text style={{fontSize: 19, fontFamily: 'InterB', color: 'white'}}>{subjectStats.average}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 10}}>
            <Text style={{
                color: 'white',
                fontSize: 24, 
                fontWeight: 'medium', 
                fontFamily: 'InterB',
                marginRight: 10,
                }}>Neue Note</Text>
            <Pressable onPress={() => navigation.navigate("NewGrade", subject)}style={{
                    textAlign: 'center',
                    borderRadius: 5
                    }}>
                    <Ionicons name="add-circle-outline" size={28} color="#FFB600" />
            </Pressable>
        </View>
    </View>
    {grade.map((post,index) => (
        <Pressable key={Math.random()} style={{
            backgroundColor: '#1B1F47',
            padding: 20, 
            borderRadius: 20, 
            marginTop: 20,
            }}>
            <View style={{
                flexDirection:'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 15,
                }}>
                <Text style={{
                    fontSize: 24,
                    fontFamily: 'PDSemi',
                    color: '#FFB600'
                }}>{post.name}</Text>
                <Pressable onPress={() => handleDelete(post._id)}>
                    <Ionicons name="ios-trash-outline" size={26} color='#FFB600' />
                </Pressable>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 5}}>
                <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', backgroundColor: '#242853', padding: 10, borderRadius: 10,flexWrap: 'wrap'}}>
                    <Text style={{fontSize: 16, fontFamily: 'InterB', color: 'white'}}>Note</Text>
                    <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>{post.grade}</Text>
                </View>
                <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', backgroundColor: '#242853', padding: 10, borderRadius: 10, marginLeft: 5,flexWrap: 'wrap'}}>
                    <Text style={{fontSize: 16, fontFamily: 'InterB', color: 'white'}}>Gewichtung</Text>
                    <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>{post.weight}</Text>
                </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',backgroundColor: '#242853', padding: 10, borderRadius: 10, marginBottom: 5,flexWrap: 'wrap'}}>
                <Text style={{fontSize: 16, fontFamily: 'InterB', color: 'white'}}>Anzahl Lerntage</Text>
                <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>{post.days}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',backgroundColor: '#242853', padding: 10, borderRadius: 10, marginBottom: 5, flexWrap: 'wrap'}}>
                <Text style={{fontSize: 16, fontFamily: 'InterB', color: 'white'}}>Anzahl Lernstunden</Text>
                <Text style={{fontSize: 16, fontFamily: 'InterM', color: 'white'}}>{post.hours}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',backgroundColor: '#242853', padding: 10, borderRadius: 10, marginBottom: 5, flexWrap: 'wrap'}}>
                <Text style={{fontSize: 16, fontFamily: 'InterB', color: 'white', marginRight: 5}}>Tipps</Text>
                <Text style={{fontSize: 16,
                    fontFamily: 'InterM',
                    color: 'white',
                    }}>{post.tips}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',backgroundColor: '#242853', padding: 10, borderRadius: 10, marginBottom: 5, flexWrap: 'wrap'}}>
                <Text style={{fontSize: 16, fontFamily: 'InterB', color: 'white'}}>Lernmethoden</Text>
                <View>
                    {post.methods.map((content,index) => (
                        <Text key={index} style={{ 
                        fontFamily: 'InterM',
                        fontSize: 16,
                        color: 'white',
                        }}>- {content}</Text>
                    ))}
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
        <SafeAreaView style={{flex: 1,backgroundColor: '#12142a'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {content()}
            </ScrollView>
        </SafeAreaView>
    )
}

export default SubjectScreen

const styles = StyleSheet.create({})
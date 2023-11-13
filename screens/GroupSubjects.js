import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, TextInput } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React,{ useState, useEffect, useLayoutEffect, useContext } from "react";
import { UserType } from "../UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from "jwt-decode";
import axios, { all } from "axios";
import { Ionicons } from '@expo/vector-icons';

const GroupSubjects = () => {
  const navigation = useNavigation();
  const [loading,setLoading] = useState(true);
  const route = useRoute();
  const group = route.params;
  const [groupSemester, setGroupSemester] = useState([]);
  const [groupSubjects, setGroupSubjects] = useState([]);
  const [general, setGeneral] = useState([]);
  const [subArray, setSubArray] = useState([]);

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

  const fetchSubjects = async (group) => {
    //1. Get users who are members in the group
    await axios
        .get(`https://ma-app.vercel.app/groups/users/${group}`)
            .then((response) => {
                findSemesters(response.data[0].members);
            }).catch((error) => {
                console.log("error retrieving users", error);
        });

    //5. send the name and the _ids as route.params to the statistics screen
  }

  const findSemesters = async (users) => {
    //2. Get all the semesters owned by the users
    var allSems = []
    var allUsers = [];
    for (i = 0; i < users.length; i++) {
      await axios
            .get(`https://ma-app.vercel.app/users/${users[i]}`)
            .then((response) => {
              allUsers.push(response.data);
            })
            .catch((error) => {
                console.log("error retrieving users", error);
            });
      
      await axios
            .get(`https://ma-app.vercel.app/semesters/${users[i]}`)
            .then((response) => {
                if (response.data != [] && allUsers[i].shareGrades) {
                  for (j = 0; j < response.data.length; j++) {
                    allSems.push(response.data[j]._id);
                  }
                }
            }).catch((error) => {
                console.log("error retrieving semesters", error);
            });
    }
    findSubjects(allSems);
  }

  const findSubjects = async (semester) => {
    //3. Get the subjects that belong to the semesters
    var allSubs = []
    for (k = 0; k < semester.length; k++) {
      await axios
            .get(`https://ma-app.vercel.app/subjects/${semester[k]}`)
            .then((response) => {
                if (response.data != []) {
                  for (l = 0; l < response.data.length; l++) {
                    if (response.data[l].shared) {
                      allSubs.push({sub_id: response.data[l]._id, sub_name: response.data[l].name});
                    }
                  }
                }
            }).catch((error) => {
                console.log("error retrieving subjects", error);
            });
    }
    SubjectArray(allSubs);
  }
  const SubjectArray = (subjects) => {
    //4. Make an array with the subjects that includes the name (that is the same with all the people) and the _ids of the semesters with that name
    const resultArray = [];
    const generalArray = [];

    subjects.forEach(item => {
      generalArray.push(item.sub_id);
      const existingItem = resultArray.find(resultItem => resultItem.sub_name.trim() === item.sub_name);
      if (existingItem) {
        existingItem.sub_ids.push(item.sub_id);
      } else {
        resultArray.push({ sub_name: item.sub_name, sub_ids: [item.sub_id] });
      }
    });

    setSubArray(resultArray);
    setGeneral(generalArray);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    fetchSubjects(group._id);
    
  }, [group]);



  const content = () => {
    if (loading) {
      return (
        <View>
            <ActivityIndicator style={{marginTop: 200, marginBottom: 20}} color='#FFB600' size="large"/>
            <Text style={{fontSize: 16, fontFamily:"InterB", color: '#FFB600', textAlign: 'center', padding: 20}}>Es müssen viele Daten geladen werden. Dies könnte einen Moment dauern.</Text>
        </View>
    )
    } else {
        return (
          <View style={{padding: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
            <Text style={{
              color: '#FFB600',
              fontSize: 40, 
              fontWeight: 'medium', 
              fontFamily: 'PDBold',
              marginBottom: 10,
              marginRight: 10
              }}>{group.name}</Text>
            <Pressable onPress={() => navigation.navigate("GroupMembers", group)} style={{
                  flexDirection:'row', 
                  alignItems: 'center', 
                  borderRadius: 10, 
                  marginBottom: 20,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: '#1B1F47',
                  }}>
                    <Ionicons name="ios-people-outline" size={24} color="#FFB600" />
            </Pressable>
          </View>
          <Text style={{color: 'white',
          fontSize: 32, 
          fontWeight: 'medium', 
          fontFamily: 'InterM'}}>Fächer</Text>
          <Pressable key={Math.random() * 10000000}
            onPress={() => navigation.navigate("GroupStatistics", {group: group, subjects: general, name: "Alle Fächer"})}
            style={{
              padding: 20, 
              borderRadius: 20, 
              marginTop: 20,
              backgroundColor: '#1B1F47'

              }}>
              <View style={{flexDirection: 'row', alignItems: 'center',flexWrap:'wrap'}}>
                  <Text style={{
                      fontSize: 24,
                      color: 'white',
                      fontFamily: 'PDSemi'
                  }}>Alle Fächer</Text>
              </View>
          </Pressable>
          {subArray.map((post, index) => (
            <Pressable key={Math.random() * 10000000}
              onPress={() => navigation.navigate("GroupStatistics", {group: group, subjects: post.sub_ids, name: post.sub_name})}
              style={{
              padding: 20, 
              borderRadius: 20, 
              marginTop: 20,
              backgroundColor: '#1B1F47'

              }}
              >
              <View style={{flexDirection: 'row', alignItems: 'center',flexWrap:'wrap'}}>
                  <Text style={{
                      fontSize: 24,
                      color: 'white',
                      fontFamily: 'PDSemi'
                  }}>{post.sub_name}</Text>
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

export default GroupSubjects

const styles = StyleSheet.create({})
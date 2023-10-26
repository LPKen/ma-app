import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, TextInput } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import React,{ useState, useEffect, useLayoutEffect, useContext } from "react";
import { UserType } from "../UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from "jwt-decode";
import axios, { all } from "axios";
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from "react-native-gifted-charts";

const GroupStatistics = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const groupSendBack = route.params.group;
    const [loading,setLoading] = useState(true);
    const subName = route.params.name;
    const subjects = route.params.subjects;
    const {userId,setUserId} = useContext(UserType);
    const [proportionals,setProportionals] = useState(true);
    const [stats,setStats] = useState({
        freq_methods: [{method: "Laden ...", frequency: 1}],
        tips: ["Laden ...", "Laden ...", "Laden ..."]
    });


  const buildStats = async (subjects) => {
    //Avg, Avg Tage, Avg Stunden, Avg Note Tage, Avg Note Stunden
    //Avg Lernmethoden, Häufigste Lermethoden, Alle Tipps
    var gradeArray = [];

    var gradeStats = {
        avg: 0,
        avg_days: 0,
        avg_hours: 0,
        avg_grade_hours: [],
        //[{hours: hour1, grade: grade1},{hours: hour2, grade: grade2}]
        avg_grade_days: [],
        //[{days: day1, grade: grade1},{days: day2, grade: grade2}]
        avg_methods: [],
        //[{methods: [methods1], grade: grade1},{methods: [methods2], grade: grade2}]
        freq_methods: [],
        //[{method: method1, frequency: f1},{method: method2, frequency: f2}]
        tips: [],
        //[tip1, tip2]
    }

    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    setUserId(userId);

    for (i = 0; i < subjects.length; i++) {

        await axios
        .get(`https://ma-app.vercel.app/grades/${subjects[i]}`)
        .then((response) => {
            if (response.data.length > 0) {
                for (j = 0; j < response.data.length; j++) {
                    gradeArray.push(response.data[j]);
                    gradeStats.avg = avg(gradeArray);
                    gradeStats.avg_days = avgDays(gradeArray, userId);
                    gradeStats.avg_hours = avgHours(gradeArray, userId);
                    gradeStats.tips = getTips(gradeArray);
                    gradeStats.avg_grade_hours = avgGradeHours(gradeArray, userId);
                    gradeStats.avg_grade_days = avgGradeDays(gradeArray, userId);
                    gradeStats.freq_methods = frequency(gradeArray);
                    gradeStats.avg_methods = avgMethods(gradeArray);
                }
            } else {
            }
        }).catch((error) => {
            console.log("error retrieving users", error);
        });
    }
    setStats(gradeStats);
    setLoading(false);
  }


  const avg = (grades) => {
    var average = 0;
    var numOfTests = 0;
    for (k = 0; k < grades.length; k++) {
        average += grades[k].grade * grades[k].weight;
        numOfTests += grades[k].weight;
    }
    average = Math.round(average / numOfTests * 100)/100;
    return average;
  }

  const avgDays = (days, user) => {
    axios
    .get(`https://ma-app.vercel.app/users/${user}`)
    .then((response) => {
        setProportionals(response.data.propWeight);
    })
    .catch((error) => {
        console.log("error retrieving gradedays", error);
    });

    var average = 0;
    var numOfTests = 0;
    for (l = 0; l < days.length; l++) {
        if (days[l].days) {
            if (proportionals) {
                average += days[l].days * days[l].weight;
            } else {
                average += days[l].days;
            }
            numOfTests += days[l].weight;
        }
    }
    average = Math.round(average / numOfTests * 100)/100;
    if (numOfTests == 0) {average = 0;}
    return average;
  }
  

  const avgHours = (hours, user) => {
    axios
    .get(`https://ma-app.vercel.app/users/${user}`)
    .then((response) => {
        setProportionals(response.data.propWeight);
    })
    .catch((error) => {
        console.log("error retrieving hours", error);
    });

    var average = 0;
    var numOfTests = 0;
    for (m = 0; m < hours.length; m++) {
        if (hours[m].hours) {
            if (proportionals) {
                average += hours[m].hours * hours[m].weight;
            } else {
                average += hours[m].hours;
            }
            numOfTests += hours[m].weight;
        }
    }
    average = Math.round(average / numOfTests * 100)/100;
    if (numOfTests == 0) {average = 0;}
    return average;
  }




  const getTips = (tips) => {
    var tipArray = [];
    for (var n = 0; n < tips.length; n++) {
        if (tips[n].tips != "") {
            tipArray.push(tips[n].tips);
        }
    }
    return tipArray;
  }

  const frequency = (methods) => {
    const resultArray = [];
// Flatten the originalArray to create an array of all methods
    const allMethods = methods.flatMap(item => item.methods);

    allMethods.forEach(method => {
        const existingMethod = resultArray.find(resultItem => resultItem.method === method);

        if (existingMethod) {
            existingMethod.frequency++;
        } else {
            resultArray.push({ method, frequency: 1 });
        }
    });

    // Sort the resultArray by frequency in descending order
    resultArray.sort((a, b) => b.frequency - a.frequency);

    return(resultArray);
  }


  const avgGradeHours = (GHArray, user) => {
    const resultArray = [];

    axios
        .get(`https://ma-app.vercel.app/users/${user}`)
        .then((response) => {
            setProportionals(response.data.propWeight);
        })
        .catch((error) => {
            console.log("error retrieving gradehours", error);
        });
    
    

    GHArray.forEach(item => {
        if (item.hours) {
            var product = Math.round(item.hours / item.weight * 2)/2;
            if (!proportionals) {
                product = Math.round(item.hours * 2)/2;
            }
            const existingItem = resultArray.find(resultItem => resultItem.label === product);
        
            if (existingItem) {
            existingItem.grades.push(item.grade);
            } else {
                resultArray.push({
                    label: product,
                    grades: [item.grade],
                    topLabelComponent: () => (
                        <Text style={{color: 'white', fontSize: 12, marginBottom: 6}}>{item.grade}</Text>
                    ),
            });
            }
        }
    });

    // Calculate the average grade for each entry in resultArray
    resultArray.forEach(item => {
        const totalGrade = item.grades.reduce((sum, grade) => sum + grade, 0);
        item.value = Math.round(totalGrade / item.grades.length * 100) / 100;
        // Optional: You can remove the 'grades' array if you no longer need it.
        delete item.grades;
        item.topLabelComponent = () => (
            <Text style={{color: 'white', fontSize: 12, marginBottom: 6}}>{item.value}</Text>
        )    
    });

    // Sort the resultArray by frequency in ascending order
    resultArray.sort((a, b) => a.label - b.label);

    return resultArray;
  }


    const avgGradeDays = (GDArray, user) => {
        const resultArray = [];

        axios
            .get(`https://ma-app.vercel.app/users/${user}`)
            .then((response) => {
                setProportionals(response.data.propWeight);
            })
            .catch((error) => {
                console.log("error retrieving gradedays", error);
            });

        GDArray.forEach(item => {
            if (item.weight >= 1 && item.days) {
                var product = Math.round(item.days / item.weight * 2)/2;
                if (!proportionals) {
                    product = Math.round(item.days * 2)/2;
                }
                const existingItem = resultArray.find(resultItem => resultItem.label === product);
            
                if (existingItem) {
                existingItem.grades.push(item.grade);
                } else {
                resultArray.push({
                    label: product,
                    grades: [item.grade],
                    topLabelComponent: () => (
                        <Text style={{color: 'white', fontSize: 12, marginBottom: 6}}>{item.grade}</Text>
                    ),
                });
                }
            }
        });
        // Calculate the average grade for each entry in resultArray
        resultArray.forEach(item => {
            const totalGrade = item.grades.reduce((sum, grade) => sum + grade, 0);
            item.value = Math.round(totalGrade / item.grades.length * 100) / 100;
            // Optional: You can remove the 'grades' array if you no longer need it.
            delete item.grades;
            item.topLabelComponent = () => (
                <Text style={{color: 'white', fontSize: 12, marginBottom: 6}}>{item.value}</Text>
            )
    });
    // Sort the resultArray by frequency in ascending order
    resultArray.sort((a, b) => a.label - b.label);

    return resultArray;
  }


    const avgMethods = (gradeMethods) => {
        
        const resultArray = [];

        const methodsMap = new Map(); // Map to track grades and method occurrences

        // Iterate through the original array
        gradeMethods.forEach(item => {
            if (item.methods != []) {
                item.methods.forEach(method => {
                    if (methodsMap.has(method)) {
                    methodsMap.get(method).grades.push(item.grade);
                    } else {
                    methodsMap.set(method, { grades: [item.grade] });
                    }
                });
            }
        });

        // Calculate the average grade for each method
        for (const [method, data] of methodsMap) {
        const grades = data.grades;
        const totalGrade = grades.reduce((sum, grade) => sum + grade, 0);
        const averageGrade = Math.round(totalGrade / grades.length *100)/100;
        resultArray.push({
            label: method.substring(0, 3),
            value: averageGrade,
            topLabelComponent: () => (
                <Text style={{color: 'white', fontSize: 12, marginBottom: 6}}>{averageGrade}</Text>
            ),
        });
        }

        // Sort the resultArray by frequency in descending order
        resultArray.sort((a, b) => b.value - a.value);


        return(resultArray);
    }

    useEffect(() => {
        setLoading(true);
        buildStats(subjects); 
    },[subjects, userId]);


const content = () => {
    if (loading) {
        return <ActivityIndicator style={{marginTop: 200}} color='#FFB600' size="large"/>
    } else if (subjects.length > 0) {
        return (
            <View>
                <Text style={{
                    color: '#FFB600',
                    fontSize: 40, 
                    fontWeight: 'medium', 
                    fontFamily: 'PDBold',
                    marginBottom: 20
                    }}>{subName}</Text>
                    <Text style={{color: 'white',
                    fontSize: 32, 
                    fontWeight: 'medium', 
                    fontFamily: 'InterM'}}>Statistiken</Text>
                    <View style={{flex: 1,
                        backgroundColor: '#1B1F47',
                        padding: 20,
                        borderRadius: 20,
                        marginTop: 20,
                        }}>
                        <Text style={{
                            color: '#FFB600',
                            fontFamily: 'PDBold',
                            fontSize: 20,
                            marginBottom: 10,
                        }}>⌀ Note</Text>
                        <Text style={{
                            color: 'white',
                            fontFamily: 'InterB',
                            fontSize: 32
                        }}>{stats.avg}</Text>
                    </View>

                    <View style={{flex: 1,
                        backgroundColor: '#1B1F47',
                        padding: 20,
                        borderRadius: 20,
                        marginTop: 20,
                        }}>
                        <Text style={{
                            color: '#FFB600',
                            fontFamily: 'PDBold',
                            fontSize: 20,
                            marginBottom: 10,
                        }}>⌀ Lerntage</Text>
                        <Text style={{
                            color: 'white',
                            fontFamily: 'InterB',
                            fontSize: 32
                        }}>{stats.avg_days}</Text>
                    </View>
                    
                    <View style={{flex: 1,
                        backgroundColor: '#1B1F47',
                        padding: 20,
                        borderRadius: 20,
                        marginTop: 20,
                        }}>
                        <Text style={{
                            color: '#FFB600',
                            fontFamily: 'PDBold',
                            fontSize: 20,
                            marginBottom: 10,
                        }}>⌀ Lernstunden</Text>
                        <Text style={{
                            color: 'white',
                            fontFamily: 'InterB',
                            fontSize: 32
                        }}>{stats.avg_hours}</Text>
                    </View>

                    <View style={{flex: 1,
                        backgroundColor: '#1B1F47',
                        padding: 20,
                        borderRadius: 20,
                        marginTop: 20,
                        }}>
                        <Text style={{
                            color: '#FFB600',
                            fontFamily: 'PDBold',
                            fontSize: 20,
                            marginBottom: 10,
                        }}>⌀ Note nach Anzahl Lerntagen</Text>
                        <BarChart
                            data={stats.avg_grade_days} 
                            barWidth={27}
                            initialSpacing={5}
                            spacing={15}
                            noOfSections={3}
                            barBorderRadius={15}
                            frontColor="white"             
                            yAxisThickness={0}        
                            xAxisThickness={1}
                            rulesColor={'#234778'}
                            xAxisColor={'#234778'}
                            maxValue={6}
                            height={150}
                            width={250}
                            xAxisLabelTextStyle={{color: 'white', textAlign: 'center', fontSize: 12}}
                            yAxisTextStyle={{color: 'white', textAlign: 'center', fontSize: 12}}
                        />
                    </View>

                    <View style={{flex: 1,
                        backgroundColor: '#1B1F47',
                        padding: 20,
                        borderRadius: 20,
                        marginTop: 20,
                        }}>
                        <Text style={{
                            color: '#FFB600',
                            fontFamily: 'PDBold',
                            fontSize: 20,
                            marginBottom: 10,
                        }}>⌀ Note nach Anzahl Lernstunden</Text>
                        <BarChart
                            data={stats.avg_grade_hours} 
                            barWidth={27}
                            initialSpacing={5}
                            spacing={15}
                            noOfSections={3}
                            barBorderRadius={15}
                            frontColor="white"             
                            yAxisThickness={0}        
                            xAxisThickness={1}
                            rulesColor={'#234778'}
                            xAxisColor={'#234778'}
                            maxValue={6}
                            height={150}
                            width={250}
                            xAxisLabelTextStyle={{color: 'white', textAlign: 'center', fontSize: 12}}
                            yAxisTextStyle={{color: 'white', textAlign: 'center', fontSize: 12}}
                        />
                    </View>

                    <View style={{flex: 1,
                        backgroundColor: '#1B1F47',
                        padding: 20,
                        borderRadius: 20,
                        marginTop: 20,
                        }}>
                        <Text style={{
                            color: '#FFB600',
                            fontFamily: 'PDBold',
                            fontSize: 20,
                            marginBottom: 10,
                        }}>⌀ Note nach Lernmethoden</Text>
                        <BarChart
                            data={stats.avg_methods}  
                            barWidth={27}
                            initialSpacing={5}
                            spacing={15}
                            noOfSections={3}
                            barBorderRadius={15}
                            frontColor="white"             
                            yAxisThickness={0}        
                            xAxisThickness={1}
                            rulesColor={'#234778'}
                            xAxisColor={'#234778'}
                            maxValue={6}
                            height={150}
                            width={250}
                            xAxisLabelTextStyle={{color: 'white', textAlign: 'center', fontSize: 12}}
                            yAxisTextStyle={{color: 'white', textAlign: 'center', fontSize: 12}}
                        />
                        <View style={{
                            marginTop: 25,
                            padding: 10,
                            borderTopColor: '#234778',
                            borderTopWidth: 1,
                            }}>
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'PDSemi'
                                }}
                            >Tex: Texte/Artikel/Unterlagen lesen</Text>
                            <Text
                                style={{
                                    marginTop: 5,
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'PDSemi'
                                }}
                            >Auf: Aufgaben/Fallbeispiele lösen</Text>
                            <Text
                                style={{
                                    marginTop: 5,
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'PDSemi'
                                }}
                            >Zus: Zusammenfassungen schreiben</Text>
                            <Text
                                style={{
                                    marginTop: 5,
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'PDSemi'
                                }}
                            >Blu: Blurting</Text>
                            <Text
                                style={{
                                    marginTop: 5,
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'PDSemi'
                                }}
                            >Kar: Karteikarten</Text>
                            <Text
                                style={{
                                    marginTop: 5,
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'PDSemi'
                                }}
                            >Den: Den Stoff jemandem erklären</Text>
                            <Text
                                style={{
                                    marginTop: 5,
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'PDSemi'
                                }}
                            >Vis: Visualisierung (z.B. Mindmap)</Text>
                            <Text
                                style={{
                                    marginTop: 5,
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'PDSemi'
                                }}
                            >Vid: Videos/Präsentationen anschauen</Text>
                        </View>

                    </View>

                    <View style={{flex: 1,
                        backgroundColor: '#1B1F47',
                        padding: 20,
                        borderRadius: 20,
                        marginTop: 20,
                        }}>
                            <Text style={{
                            color: '#FFB600',
                            fontFamily: 'PDBold',
                            fontSize: 20,
                            marginBottom: 10,
                        }}>Häufigste Lermethoden</Text>
                        {stats.freq_methods.map((post,index) => (
                            <Text key={Math.random()} style={{
                                color: 'white',
                                fontFamily: 'PDSemi',
                                fontSize: 16
                            }}>{index + 1}. {post.method} (x{post.frequency})</Text>
                        ))}
                    </View>

                    <View style={{flex: 1,
                        backgroundColor: '#1B1F47',
                        padding: 20,
                        borderRadius: 20,
                        marginTop: 20,
                        }}>
                            <Text style={{
                            color: '#FFB600',
                            fontFamily: 'PDBold',
                            fontSize: 20,
                            marginBottom: 10,
                        }}>Alle Tipps zum Fach</Text>
                        {stats.tips.map((post,index) => (
                            <Text key={Math.random()} style={{
                                color: 'white',
                                fontFamily: 'PDSemi',
                                fontSize: 16
                            }}>- {post}</Text>
                        ))}
                    </View>
                    
                </View>
        )
    }
}

    return (
        <SafeAreaView style={{flex: 1,backgroundColor: '#12142A'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{padding: 20}}>
                    <Pressable onPress={() => navigation.navigate("GroupSubjects", groupSendBack)} style={{paddingBottom:10, paddingTop:15}}>
                        <Ionicons name="arrow-back-outline" size={36} color="white" />
                    </Pressable>
                    {content()}
                    
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GroupStatistics

const styles = StyleSheet.create({})
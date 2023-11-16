import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    Alert
} from 'react-native'
import React, { useState, useEffect } from 'react'
import axios, { all } from "axios";
import { useNavigation, useRoute, useScrollToTop, useFocusEffect } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const GradeCalculator = () => {
    const route = useRoute();
    const navigation = useNavigation();
    
    const stats = route.params.stats;
    const [dream, setDream] = useState("");
    const [weight, setWeight] = useState("");
    const [neededGrade, setneededGrade] = useState();
    console.log("Stats",stats);

    const calculateGrade = (grade, weight) => {
        var ipts = [grade,weight];
        const allInputsFilled = ipts.every((input) => input.trim() !== '');

        if (allInputsFilled) {
            var goalGrade = parseFloat(grade) * (parseFloat(weight) + stats.weight);
            console.log("GoalGrade", goalGrade);
            var currentGrade = stats.average * stats.weight;
            console.log("CurrentGrade", currentGrade);
            setneededGrade(Math.round((goalGrade - currentGrade)/parseFloat(weight)*100)/100);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#12142A' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 20 }}>
                    <Pressable onPress={() => navigation.navigate("Subjects", route.params.sub)} style={{paddingBottom:10, paddingTop:15}}>
                        <Ionicons name="arrow-back-outline" size={36} color="white" />
                    </Pressable>
                    <Text style={{
                        color: '#FFB600',
                        fontSize: 40,
                        fontFamily: 'PDBold'
                    }}
                    >Notenrechner</Text>
                    <KeyboardAvoidingView>
                        <Text style={{
                            marginTop: 10,
                            color: 'white',
                            fontSize: 20,
                            fontFamily: 'InterM'
                        }}>Wunschnote</Text>
                        <TextInput
                            keyboardType='numeric'
                            value={dream}
                            onChangeText={
                                (text) => {
                                    setDream(text);
                                    calculateGrade(text, weight);
                                }
                            }
                            style={{
                                fontSize: dream ? 24 : 24,
                                marginTop: 10,
                                width: '100%',
                                padding: 10,
                                borderRadius: 10,
                                color: 'white',
                                backgroundColor: '#1B1F47',
                                fontFamily: 'InterM'
                            }}
                        />
                        <Text style={{
                            marginTop: 10,
                            color: 'white',
                            fontSize: 20,
                            fontFamily: 'InterM'
                        }}>Gewichtung</Text>
                        <TextInput
                            keyboardType='numeric'
                            value={weight}
                            onChangeText={
                                (text) => {
                                    setWeight(text);
                                    calculateGrade(dream, text);
                                }
                            }
                            style={{
                                fontSize: weight ? 24 : 24,
                                marginTop: 10,
                                width: '100%',
                                padding: 10,
                                borderRadius: 10,
                                color: 'white',
                                backgroundColor: '#1B1F47',
                                fontFamily: 'InterM'
                            }}
                        />
                    </KeyboardAvoidingView>
                    <View style={{flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: '#1b1f47',
                    padding: 10,
                    borderRadius: 10,
                    marginTop: 20}}>
                        <Text style={{fontSize: 20, fontFamily: 'InterM', color: 'white'}}>Benötigte Note</Text>
                        <Text style={{fontSize: 20, fontFamily: 'InterB', color: 'white'}}>{neededGrade}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GradeCalculator

const styles = StyleSheet.create({})
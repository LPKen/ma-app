import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';


const TutorialScreen = () => {
  const [info,setInfo] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  useLayoutEffect(() => {
    navigation.setOptions({
        headerStyle: {
            backgroundColor: "#12142A",
        },
        headerShadowVisible: false,
        headerTitle: "",
        headerLeft: () => (
            <Pressable onPress={() => navigation.navigate("Infos")} style={{paddingLeft: 20, paddingBottom: 10}}>
                <Ionicons name="arrow-back-outline" size={36} color="white" />
            </Pressable>
        ),
    })
},[])

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
      <Image style={{
          width: 150,
          resizeMode: "contain",
          alignSelf: "center",
        }}
        source={
          require('../assets/logo_text.png')
        }
      />
        <View style={{padding: 20}}>
          <Text style={{color: 'white',fontSize: 40, fontWeight: 'medium', fontFamily: 'PDBold'}}>Häufige Fragen</Text>
          <Text style={{color: 'white',fontSize: 28, fontFamily: 'PDBold', marginTop: 30}}>Wie kann ich ein/e Semester/Fach/Prüfung erstellen?</Text>
          <Text style={{
            color: '#ffffff',
            fontSize: 20, 
            fontFamily: 'PDSemi',
            marginTop: 10,
            }}>Auf dem Bild unten sieht man den Home-Screen. Wenn man auf das (+) klickt, kann man ein neues Semester erstellen.{"\n"}{"\n"}
            Um ein neues Fach oder eine neue Prüfung zu erstellen, kann man auf dem Semester-Screen oder auf dem Fach-Screen ebenfalls auf das (+) klicken.</Text>
            <Image style={{
              width: "auto",
              height: 250,
              resizeMode: "contain",
              borderWidth: 3,
              borderColor: "#00000022",
            }}
            source={
              require('../assets/neusem.png')
            }
          />
          <Text style={{color: 'white',fontSize: 28, fontFamily: 'PDBold', marginTop: 30}}>Wie kann ich einer Gruppe beitreten oder eine erstellen?</Text>
          <Text style={{
            color: '#ffffff',
            fontSize: 20, 
            fontFamily: 'PDSemi',
            marginTop: 10,
            }}>Um einer Gruppe beizutreten, kannst du auf "Eine neue Gruppe suchen ..." klicken und dort den Gruppennamen eingeben. Somit wird dem Gruppenadmin eine Anfrage gesendet.{"\n"}{"\n"}
            Um eine neue Gruppe zu erstellen, klickst du auf das (+) neben "Gruppen".</Text>
          <Text style={{color: 'white',fontSize: 28, fontFamily: 'PDBold', marginTop: 30}}>Wo sind die Statistiken und was bringen sie?</Text>
          <Text style={{
            color: '#ffffff',
            fontSize: 20, 
            fontFamily: 'PDSemi',
            marginTop: 10,
            }}>Die Statistiken befinden sich in jeder Gruppe. Du kannst darauf zugreifen, indem du auf die Gruppe klickst und dann ein Fach auswählst.{"\n"}{"\n"}
            Die Statistiken sollten den Benutzerinnen und Benutzern mehr Klarheit über die Vorbereitung auf ein bestimmtes Fach geben. Sie helfen dir dabei, zu entscheiden, wie du auf die nächste Prüfung lernen sollst.</Text>
          <Text style={{color: 'white',fontSize: 28, fontFamily: 'PDBold', marginTop: 30}}>Wie kann ich meinen Usernamen und mein Profilbild ändern?</Text>
          <Text style={{
            color: '#ffffff',
            fontSize: 20, 
            fontFamily: 'PDSemi',
            marginTop: 10,
            }}>Klicke auf dem Home-Screen auf das Zahnrad-Symbol, um zu den Einstellungen zu gelangen. Von dort aus klickst du auf Account und kannst dort deine Angaben ändern.{"\n"}{"\n"}
            Wenn du dein Passwort ändern willst, kannst du das auch dort machen.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TutorialScreen;

const styles = StyleSheet.create({
});

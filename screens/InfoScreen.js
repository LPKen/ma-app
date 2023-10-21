import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import axios from "axios";
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';


const InfoScreen = () => {
  const [info,setInfo] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    const fetchInfo = async () => {
        axios
            .get('http://192.168.0.102:8000/infos/')
            .then((response) => {
                setInfo(response.data)
                setLoading(false);
            }).catch((error) => {
                console.log("error retrieving users", error);
            });
        };
        fetchInfo();
        console.log(info)
  }, []);


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
          <Text style={{color: "#FFB600",fontSize: 40, fontFamily: 'PDBold'}}>Infos</Text>
          <Text style={{color: 'white',fontSize: 24, fontFamily: 'InterM'}}>
            Zur App
          </Text>
          <Pressable onPress={() => navigation.navigate("Tutorial")} style={{
                backgroundColor: '#FFB600',
                borderRadius: 20, 
                marginTop: 20,
                marginBottom: 50,
                flexDirection: 'column',

                }}>
                <Image style={{width: 64,
                    width: '100%',
                    height: 100,
                    borderRadius: 20,
                    resizeMode: "cover",}}
                    source={
                      require('../assets/tutorial_logo.png')
                    }
                    />
                <Text style={{
                    padding: 20,
                    paddingRight: 50,
                    fontSize: 24,
                    fontFamily: 'PDBold',
                    fontWeight: 'medium',
                    color: 'black',
                }}>Scalearn - Das Tutorial (kommt bald)</Text>
            </Pressable>
            <Text style={{color: 'white',fontSize: 24, fontFamily: 'InterM'}}>
            Aktuelle Artikel
            </Text>
            <Pressable onPress={() =>
              Alert.alert("Du willst einen Artikel hier publizieren?",
              "Schicke deinen Text mit einem passenden Titel und Bild an lior.porath@stud.ken.ch!")
                  }>
              <Ionicons name="ios-create-outline" size={28} color="#FFB600" />
            </Pressable>
          {info.map((post) => (
            <Pressable key={Math.random() * 10000000} onPress={() => navigation.navigate("Article", { article: post })} style={{
                backgroundColor: '#1B1F47',
                borderRadius: 20, 
                marginTop: 20,
                flexDirection: 'column',

                }}>
                <Image key={post.image} style={{width: 64,
                    width: '100%',
                    height: 100,
                    borderRadius: 20,
                    resizeMode: "cover",}}
                    source = {{uri: post.image}}
                    />
                <Text key={post.title} style={{
                    padding: 20,
                    paddingRight: 50,
                    fontSize: 24,
                    fontFamily: 'PDBold',
                    fontWeight: 'medium',
                    color: 'white',
                }}>{post.title}</Text>
            </Pressable>
          ))}
        </View>
        )
    }
}

  return (
    <SafeAreaView style={{flex: 1,backgroundColor: "#12142A"}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {content()}
      </ScrollView>
    </SafeAreaView>
  )
}

export default InfoScreen;

const styles = StyleSheet.create({
});

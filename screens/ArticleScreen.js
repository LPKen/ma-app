import { StyleSheet, Text, View, Image, Pressable, SafeAreaView, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';


const ArticleScreen = () => {
  const [info,setInfo] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { article } = route.params;
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
      <Image style={{width: 'auto',
                    height: 250,
                    resizeMode: "contain",
                  }}
                    source = {{uri: article.image}}
                    />
        <View style={{padding: 20}}>
          <Text style={{color: 'white',fontSize: 36, fontWeight: 'medium', fontFamily: 'PDBold'}}>{article.title}</Text>
          <Text style={{color: '#ffffffaa',fontSize: 20, fontWeight: 'regular', fontFamily: 'InterM', marginTop: 10}}>
            Von {article.authors}
          </Text>
          <Text style={{
            color: '#ffffff',
            fontSize: 20, 
            fontFamily: 'PDSemi',
            marginTop: 20,
            }}>{article.text}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ArticleScreen;

const styles = StyleSheet.create({
});

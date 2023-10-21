import { StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    Alert
} from 'react-native'
import React, { useLayoutEffect, useContext, useEffect, useState } from "react"
import axios from "axios";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import ColorPicker from 'react-native-wheel-color-picker';
  
const AccountScreen = () => {
    const route = useRoute();
    const {user} = route.params;
    const [name, setName] = useState("");
    const [color,setColor] = useState('#ffffff');
    const navigation = useNavigation();
    const [size,setSize] = useState(50);

    const getUser = () => {
        axios
        .get(`http://192.168.0.102:8000/users/${user}`)
        .then((response) => {;
            setName(response.data.name);
            setColor(response.data.pfp);
        }).catch((error) => {
            console.log("error retrieving semester", error);
        });
    }

    const handleRegister = () => {

        const userUpdate = {
            "name": name,
            "pfp": color,
        };
        // send a POST  request to the backend API to register the user
        axios.put(`http://192.168.0.102:8000/user/${user}`, userUpdate)
            .then((response) => {
            setName("");
            setColor("#ffffff");
            navigation.navigate("Home");
            })
            .catch((error) => {
            Alert.alert(
                "Deine Angaben konnten nicht gespeichert werden.",
                "Bitte kontrolliere, ob du alle Angaben ausgefüllt hast."
            );
            console.log("registration failed", error);
            });
    };

    const onColorChange = color => {
      setColor(color);
    };

    const generateNewSize = () => {
      // range of possible sizes (can possibly be smaller)
      const min = 49;
      const max = 51;

      // ensures new size is different in order to trigger a reload because the state is now different in the size prop
      let newSize = size;
      while (newSize === size) {
      newSize = Math.random() * (max - min) + min;
      }

      setSize(newSize);
  }

    useEffect(() => {
        getUser()
        
    }, [user]);

    useFocusEffect(
        React.useCallback(() => {
        // Fetch data whenever the screen gains focus (e.g., when navigating back)
        getUser()
        }, [user])
    );

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#12142A",
        }}
      >
        <KeyboardAvoidingView>
          <View style={{padding: 20}}>
            <Text style={{
                          color: '#FFB600',
                          fontSize: 40, 
                          fontFamily: 'PDBold',
                          marginTop: 50
                      }}>
                          Dein Account
            </Text>
    
            <Text style={{color: 'white',
                      fontSize: 28, 
                      fontWeight: 'medium', 
                      fontFamily: 'InterM',
                      marginTop: 10
            }}>Angaben ändern</Text>
  
            <TextInput
              value={name}
              onChangeText={(text) => {
                  setName(text);
              }}
              style={{
              fontSize: 24,
              marginTop: 20,
              width: '100%',
              padding: 10,
              borderRadius: 10,
              color: 'white',
              backgroundColor: '#1B1F47',
              fontFamily: 'InterM'
              }}
              placeholderTextColor={"#ffffffaa"}
              placeholder="Name"
            />

                <View style={{
                    backgroundColor: '#1B1F47',
                    padding: 10,
                    borderRadius: 10,
                    marginTop: 10, 
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <View style={{
                        height: 40,
                        width:40,
                        borderRadius: 40,
                        backgroundColor: color,
                        marginRight: 10
                    }}></View>
                    <Text style={{
                        color: color,
                        fontSize: 24,
                        fontFamily: 'InterM'
                    }}>Wähle eine Profilfarbe</Text>
                </View>
  
            <View style={{marginBottom: 170}}>
                    <ColorPicker
                        color={color}
                        onColorChange={(color) => onColorChange(color)}
                        thumbSize={size}
                        sliderSize={size}
                        noSnap={true}
                        row={false}
                        swatches={false}
                        sliderHidden={true}
                        onInteractionStart={generateNewSize}
                    />
            </View>

            <Pressable onPress={() => navigation.navigate('NewPassword',{user: user})} style={{
                backgroundColor: '#1b1f47',
                padding: 10,
                borderRadius: 20,
                marginTop: 100,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
            }}>
                <Ionicons name="key-outline" size={28} color="white" />
                <Text style={{
                        fontFamily: 'InterB',
                        fontSize: 20,
                        color: 'white',
                        marginLeft: 5,
                    }}>Passwort ändern</Text>
            </Pressable>
  
            <Pressable
              onPress={handleRegister}
              style={{
                padding: 10,
                        borderRadius: 20,
                        width: '100%',
                        backgroundColor: '#1b1f47',
                        marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 24, textAlign: 'center', fontFamily: 'InterM', color: 'white'
                }}
              >
                Speichern
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  };
  
  export default AccountScreen;
  
  const styles = StyleSheet.create({});
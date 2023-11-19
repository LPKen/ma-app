import { StyleSheet, Text, View } from 'react-native';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import InfoScreen from './screens/InfoScreen';
import HomeScreen from './screens/HomeScreen';
import ArticleScreen from './screens/ArticleScreen';
import { Ionicons } from '@expo/vector-icons';
import NewSemester from './screens/NewSemester';
import NewSubject from './screens/NewSubject';
import NewGrade from './screens/NewGrade';
import NewGroup from './screens/NewGroup';
import SemesterScreen from './screens/SemesterScreen';
import SubjectScreen from './screens/SubjectScreen';
import GroupScreen from './screens/GroupScreen';
import GroupSearch from './screens/GroupSearch';
import RegisterScreen from './screens/RegisterScreen';
import RequestScreen from './screens/RequestScreen';
import GroupSubjects from './screens/GroupSubjects';
import GroupMembers from './screens/GroupMembers';
import GroupStatistics from './screens/GroupStatistics';
import SettingsScreen from './screens/SettingsScreen';
import TutorialScreen from './screens/TutorialScreen';
import EditSemester from './screens/EditSemester';
import EditSubject from './screens/EditSubject';
import EditGroup from './screens/EditGroup';
import AccountScreen from './screens/AccountScreen';
import NewPassword from './screens/NewPassword';
import GradeCalculator from './screens/GradeCalculator';
import ResetPassword from './screens/ResetPassword';


const StackNavigator = () => {
    //const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
    const Stack = createNativeStackNavigator();

    const TabScreens = () => {
        return (
            <Tab.Navigator screenOptions={({ route }) => ({
                tabBarStyle: {
                    backgroundColor: "#12142A",
                    borderTopWidth: 0
                },
                tabBarShadowVisible: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
    
                    if (route.name === 'Home') {
                    iconName = focused
                        ? 'ios-home'
                        : 'ios-home-outline';
                    } else if (route.name === 'Infos') {
                    iconName = focused ? 'information-circle' : 'information-circle-outline';
                    }
                    else if (route.name === 'Gruppen') {
                        iconName = focused ? 'ios-people' : 'ios-people-outline';
                    }
    
                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: '#FFB600',
            })}>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Gruppen" component={GroupScreen} options={{headerShown: false}}/>
                <Tab.Screen name="Infos" component={InfoScreen} options={{headerShown: false}}/>
                <Tab.Screen name="Article" component={ArticleScreen} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false
    
                    }}/>
                <Tab.Screen name="NewSemester" component={NewSemester} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    headerShown: false
                    }}/>
                <Tab.Screen name="EditSemester" component={EditSemester} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    headerShown: false
                    }}/>
                <Tab.Screen name="NewSubject" component={NewSubject} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    headerShown: false
                    }}/>
                <Tab.Screen name="EditSubject" component={EditSubject} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    headerShown: false
                    }}/>
                <Tab.Screen name="NewGrade" component={NewGrade} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    headerShown: false
                    }}/>
                <Tab.Screen name="NewGroup" component={NewGroup} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    headerShown: false
                    }}/>
                <Tab.Screen name="EditGroup" component={EditGroup} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    headerShown: false
                    }}/>
                <Tab.Screen name="Semester" component={SemesterScreen} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    headerShown:false
                    }}/>
                <Tab.Screen name="Subjects" component={SubjectScreen} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    headerShown: false
                    }}/>
                <Tab.Screen name="GroupSearch" component={GroupSearch} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    }}/>
                <Tab.Screen name="GroupSubjects" component={GroupSubjects} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    }}/>
                <Tab.Screen name="GroupMembers" component={GroupMembers} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    headerShown: false
                    }}/>
                <Tab.Screen name="GroupStatistics" component={GroupStatistics} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    headerShown: false,
                    }}/>
                <Tab.Screen name="Requests" component={RequestScreen} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    }}/>
                <Tab.Screen name="Settings" component={SettingsScreen} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    }}/>
                <Tab.Screen name="Account" component={AccountScreen} options={{
                    headerShown: false,
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    }}/>
                <Tab.Screen name="NewPassword" component={NewPassword} options={{
                    headerShown: false,
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    }}/>
                <Tab.Screen name="Tutorial" component={TutorialScreen} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    }}/>
                <Tab.Screen name="Calculator" component={GradeCalculator} options={{
                    tabBarButton: () => null,
                    tabBarVisible:false,
                    headerShown: false,
                    }}/>
            </Tab.Navigator>
        )
    }
    return (

    <NavigationContainer>
        <Stack.Navigator screenOptions={{gestureEnabled: false}}>
            <Stack.Screen name="Login" component={LoginScreen} options={{
                headerShown: false,
                }}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={{
                headerShown: false
                }}/>
            <Stack.Screen name="ResetPassword" component={ResetPassword} options={{
                headerShown: false
                }}/>
            <Stack.Screen name="Tabs" component={TabScreens} options={{headerShown: false}} />
        </Stack.Navigator>
    </NavigationContainer>
    )
}
//to hide a screen
//options={{
    //tabBarButton: () => null,
    //tabBarVisible:false (hide tab bar on this screen)

//}}
export default StackNavigator

const styles = StyleSheet.create({
    
})
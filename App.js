import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './config/firebase';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { ImageBackground } from 'react-native';
import UploadScreen from './screens/UploadScreen';
import ProfileScreen from './screens/ProfileScreen';
import History from './screens/History';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Colors
const primary = 'rgb(214, 163, 21)';
const disPrimary = 'rgba(214, 163, 21,0.5)';

// Instantiating Navigations
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Function
export default function App() {
  const [showHomeStack, setShowHomeStack] = useState(false);
  const Stack = createStackNavigator();

  //for checking if there is any user logged in or not 
  useEffect(() => {
    // console.log(auth.currentUser)
    if(auth.currentUser){
      console.log('yes there is a user');
    }
    else{
      console.log("not there is no user");
    }
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setShowHomeStack(true);
      }
      else {
        setShowHomeStack(false);
      }
    })
    console.log(showHomeStack);
    return unsubscribe;
  },[auth])

  // Auth Stack with Stack Navigation
  const LoginStack = () => {
    return (
      <Stack.Navigator initialRouteName='login'>
        <Stack.Screen name='login' component={LoginScreen} />
        <Stack.Screen name='signup' component={SignupScreen} />
      </Stack.Navigator>
    )
  }


// Home Stack with Tab Navigation
  const HomeStack = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            color = focused ? primary : 'aqua';
            if (route.name === 'home') {
              iconName = focused ? 'home' : 'home-outline';
            }
            else if (route.name === 'profileScreen') {
              iconName = focused ? 'person' : 'person-outline';
            }
            else if (route.name === 'uploadScreen') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }
            else if (route.name === 'history') {
              iconName = focused ? 'time' : 'time-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: primary,
          tabBarInactiveTintColor:disPrimary,
          tabBarStyle:{
            backgroundColor:'black',
            borderTopColor:primary,
            paddingTop:5,
            borderTopWidth:2,
          },
          tabBarLabelStyle:{
            fontSize:14,
            fontWeight:'bold',
          }
        }
        )}
        initialRouteName='home'
      >
        <Tab.Screen options={{tabBarLabel:'History'}} name="history" component={History} />
        <Tab.Screen options={{tabBarLabel:'Home'}} name="home" component={HomeScreen} />
        <Tab.Screen options={{tabBarLabel:'Upload'}} name="uploadScreen" component={UploadScreen} />
        <Tab.Screen options={{tabBarLabel:'Profile'}} name="profileScreen" component={ProfileScreen} />
      </Tab.Navigator>
    )
  }

  return (
    <NavigationContainer>
      {showHomeStack ? <HomeStack /> : <LoginStack />}
    </NavigationContainer>
  );
}
 //styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

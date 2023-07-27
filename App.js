import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React,{useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './config/firebase';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { onAuthStateChanged } from 'firebase/auth';

auth.settings.recaptchaVerifier = "6LdZT04nAAAAAJ46xzngTKMJXP1FugXf9pgDw2qP";

export default function App() {
  const [showHomeStack, setShowHomeStack] = useState(false);
  const Stack = createStackNavigator();

  useEffect(() => {
    const unsubscribe=onAuthStateChanged(auth,(authUser) => {
      
        if(authUser){
          setShowHomeStack(true);
        } 
        else{
          setShowHomeStack(false);
        }
    })
    return unsubscribe;
})
  
  const AuthStack=()=>(
    <Stack.Navigator initialRouteName='login'>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="signup" component={SignupScreen} />
    </Stack.Navigator>
  )
  const HomeStack=()=>(
    <Stack.Navigator initialRouteName='home'>
        <Stack.Screen name="home" component={HomeScreen} />
    </Stack.Navigator>
  )

  return (
    <NavigationContainer>
      {showHomeStack ? <HomeStack/> : <AuthStack/>}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

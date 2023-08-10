import { View, Text, StyleSheet, ImageBackground, KeyboardAvoidingView, TextInput, SafeAreaView, FlatList } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { auth } from '../config/firebase';
import { signOut } from '@firebase/auth';
import ProfileScreen from './ProfileScreen';

const primary = 'rgb(214, 163, 21)';
const disPrimary = 'rgba(214, 163, 21,0.5)';

export default function HomeScreen({ navigation }) {


  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Caption IT',
      headerShown: true,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: primary,
      },
      headerTitleStyle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 25,
      },
      headerRight: () => (
        <AntDesign name="logout" size={24} color="black" onPress={handleSignOut} style={{ paddingRight: 10 }} />
      )
    });
    // console.log(auth.currentUser)
  },[])

  const handleSignOut = () => {
    signOut(auth).then(() => console.log("Logout successful"))
      .catch((e) => { alert("error loging out", e) });
  }



  return (
    <ImageBackground source={require('../img/back-3d.png')} resizeMode='cover' style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1,alignItems:'center',justifyContent:'center',padding:10 }}>

        <Text style={styles.title}>Upload Image</Text>
        <Text style={styles.title}>Get it </Text>
        <Text style={[styles.title,{color:primary}]}>"Captioned.."</Text>
        

      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'orange',
    alignSelf: 'center',
    paddingBottom: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'orange',
    alignSelf: 'center',
    paddingBottom: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },

  noteBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: 'white',
    width: 320,
    margin: 5,
  },
  noteText: {
    flex: 7,
    fontSize: 18,
    color: 'black'

  }
})
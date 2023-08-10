import { View, Text, StyleSheet, ImageBackground, KeyboardAvoidingView, TextInput, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { auth } from '../config/firebase';
import { signOut } from '@firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../config/firebase';

const primary = 'rgb(214, 163, 21)';
const disPrimary = 'rgba(214, 163, 21,0.5)';

export default function UploadScreen({ navigation }) {

  const [uploadedImage, setUploadedImage] = useState(null);
  const [caption, setCaption] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
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
  })

  const handleSignOut = () => {
    signOut(auth).then(() => console.log("Logout successful"))
      .catch((e) => { alert("error loging in", e) });
  }

  const handleImageUpload = async () => {
    try {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!response.canceled) {
        setUploadedImage(response.uri);
        console.log(uploadedImage)
      }
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

  const handleGeneration = () => {

  }

  return (
    <ImageBackground source={require('../img/back-3d.png')} resizeMode='cover' style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>

        <View style={{ flex: 7, textAlign: 'center', justifyContent: 'center' }}>

          <ImageBackground source={{ uri: uploadedImage }} resizeMode='contain' style={{ width: 320, height: 320, alignSelf: 'center' }} />

          <View style={{ flex: 1 }}>
            
              <TextInput
                value={caption}
                onChangeText={text=>setCaption(text)}
                placeholder='Generated Caption'
                placeholderTextColor={primary}
                style={[styles.textBox]} />
              <TouchableOpacity onPress={handleGeneration} style={styles.button}>
                <Text style={styles.genText}>Generate</Text>
              </TouchableOpacity>
           
          </View>

        </View>

        <View style={[{ flex: 3, justifyContent: 'center' }, styles.imageBox]}>
          <TouchableOpacity onPress={handleImageUpload} >
            <Text style={styles.subTitle}>Upload Image</Text>
          </TouchableOpacity>
        </View>

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
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: primary,
    height: 50,
    width: 250,
    alignSelf: 'center',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },

  imageBox: {
    backgroundColor: 'black',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    width: 320,
    margin: 5,
  },
  textBox: {
    backgroundColor: 'black',
    alignSelf: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    width: 320,
    margin: 5,
    fontSize: 18,
    borderRadius: 10
  },
})
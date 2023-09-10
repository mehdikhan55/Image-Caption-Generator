import { View, Text, StyleSheet, ImageBackground, KeyboardAvoidingView, TextInput, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { auth } from '../config/firebase';
import { signOut } from '@firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../config/firebase';
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import {
  collection,
  getDoc,
  setDoc,
  addDoc,
  doc, // You can also import 'doc' if you use it to create Firestore document references.
} from 'firebase/firestore';
import shortid from 'shortid';


const primary = 'rgb(214, 163, 21)';
const disPrimary = 'rgba(214, 163, 21,0.5)';

export default function UploadScreen({ navigation }) {

  const [uploadedImage, setUploadedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploadedImageDownloadUrl, setUploadedImageDownloadUrl] = useState('')
  const [recordId, setRecordId] = useState(null)

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

  // 1- for image  upload from gallery or drive
  const handleImageUpload = async () => {
    try {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      const settingImageUrl = async () => {
        if (!response.canceled) {
          setUploadedImage(response.assets[0].uri);
          console.log('uploaded image information: ' + uploadedImage)
        }
      }
      await settingImageUrl();
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

  // 2- will generate caption,upload image to firebase and give a download url for the image so it can be added in the record in firebase
  const handleGeneration = () => {
    if (uploadedImage == null) return;
    if (!recordId) {
      const newRecordId = shortid.generate().replace(/[^a-zA-Z0-9_-]/g, '_');
      setRecordId(newRecordId);
    }

    const imageRef = ref(storage, `images/${recordId + "_" + (new Date())}`);

    uploadBytes(imageRef, uploadedImage)
      .then(() => {
        alert("image uploaded");

        getDownloadURL(imageRef)
          .then((downloadUrl) => {
            setUploadedImageDownloadUrl(downloadUrl);

            // Now, downloadUrl is available, you can use it here
            console.log("download url of the uploaded image is: ", downloadUrl);

            // Move the Firestore operation inside the getDownloadURL callback
            addNewFirebaseRecord(downloadUrl).then(() => {
              console.log("Successfully added record to firebase!");
            }).catch((e) => console.log("Error adding record to firebase: ", e));
          })
          .catch((e) => console.error("Error getting download URL:", e));
      })
      .catch((e) => console.error("Error uploading:", e));
  }


  // 3- for Adding new record to the firebase
  const addNewFirebaseRecord = async () => {
    // Create a Firestore collection reference
    const recordsCollectionRef = collection(db, 'generationRecord');
    try {
      // Use the recordId as the document ID within the collection
      const docRef = doc(recordsCollectionRef, recordId);
      // Check if the document exists
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // If the document exists, update it
        await setDoc(docRef, {
          caption: caption,
          imageUrl: uploadedImageDownloadUrl,
          timestamp: new Date(),
        });
        alert('Record updated in Firestore');
      } else {
        // If the document doesn't exist, create it
        await addDoc(docRef, {
          caption: caption,
          imageUrl: uploadedImageDownloadUrl,
          timestamp: new Date(),
        });
        alert('Record added to Firestore');
      }
    } catch (error) {
      console.error('Error adding record to Firestore:', error);
    }
  }

  // for resseting the upload page to its initial state
  const resetUploadPage = () => {
    setCaption('');
    setUploadedImage(null);
    setUploadedImageDownloadUrl('')
  }

  return (
    <ImageBackground source={require('../img/back-3d.png')} resizeMode='cover' style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>

        <View style={{ flex: 7, textAlign: 'center', justifyContent: 'center' }}>

          <ImageBackground source={{ uri: uploadedImage }} resizeMode='contain' style={{ width: 320, height: 320, alignSelf: 'center' }} />

          <View style={{ flex: 1 }}>

            <TextInput
              value={caption}
              onChangeText={text => setCaption(text)}
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


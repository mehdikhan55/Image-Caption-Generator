import { View, Text, ImageBackground, TouchableOpacity, Image, TextInput, SafeAreaView, Alert, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useLayoutEffect, useState } from 'react'
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { validateEmail } from '../utils';
import { Picker } from '@react-native-picker/picker';


const primary = 'rgb(214, 163, 21)';
const disPrimary = 'rgba(214, 163, 21,0.5)';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [showPassWarning, setShowPassWarning] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  })

  const handleSignup = () => {
    if (validateEmail(email) && password.length >= 8) {
      setIsDisabled(false);
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        user.updateProfile({
          displayName: name,
          displayGender:gender,
        })
      })
        .then(() => console.log('User signed up!'))
        .catch((error) => {
          alert(error.message);
          console.log('Error signing up: ', error);
        }
        );
    } else if (!validateEmail(email) && email != '') {
      alert('Please enter a valid email address.');
    } else {
      setIsDisabled(true);
    }
    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
    }
  }


  return (


    <ImageBackground source={require('../img/back-neon.png')} resizeMode='cover' style={{ flex: 1 }}>
      <KeyboardAwareScrollView >
      <SafeAreaView style={styles.container}>


        <View style={styles.img}>
          <Image source={require('../img/my-icon.png')} style={{ height: 150, width: 150 }} />
        </View>

        <View style={styles.whiteSheet}>
          <SafeAreaView style={styles.form}>
            <KeyboardAvoidingView behavior='padding'>

              {/* <Text style={styles.title}>Login</Text> */}
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={text => {
                  setName(text);
                  setIsDisabled(text == '' || !validateEmail(email) || password.length < 8);
                }}
                autoCapitalize='words'
                keyboardType='default'
                textContentType='name'
                />

              <View style={styles.genderOptions}>
                <Picker
                  style={styles.picker}
                  selectedValue={gender}
                  onValueChange={(itemValue) => {
                    setGender(itemValue);
                    setIsDisabled(name === '' || !email || password.length < 8 || !itemValue);
                  }}
                  >
                  <Picker.Item label="Select gender" value={null} />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>



              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setIsDisabled(!validateEmail(text) || password.length < 8);
                  setShowEmailWarning(!validateEmail(text) && text != '');
                }}
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                />
              {showEmailWarning && <Text style={styles.warning}> * Enter a valid email</Text>}
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  setIsDisabled(!validateEmail(text) || text.length < 8);
                  setShowPassWarning(text != '' && text.length < 8);
                }}
                autoCapitalize='none'
                textContentType='password'
                autoCorrect={false}
                secureTextEntry={true}
                />
              {showPassWarning && <Text style={styles.warning}> * Choose strong password, at least 8 characters long</Text>}

              <TouchableOpacity
                onPress={handleSignup}
                disabled={isDisabled}
                style={[styles.button, { backgroundColor: isDisabled ? disPrimary : primary }]}
                >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
              <Text style={{ color: 'white' }}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('login')}>
                <Text style={{ color: 'aqua' }}>Login</Text>
              </TouchableOpacity>
            </View>

          </SafeAreaView>


        </View>
      </SafeAreaView>
      </KeyboardAwareScrollView>
    </ImageBackground>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: -100,
    paddingTop: 100
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    paddingBottom: 10,
    fontWeight: 'bold',
  },
  whiteSheet: {
    width: '100%',
    flex: 1,
  },
  img: {
    alignSelf: 'center',
    marginTop: 100,
  },
  input: {
    backgroundColor: '#F6F7FB',
    height: 50,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 10,
  },
  form: {
    flex: 1,
    // justifyContent: 'center',
    marginTop: 120,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,

  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
  warning: {
    fontSize: 11,
    color: 'red',
    marginTop: -18,
    marginBottom: 10,
  },
  genderOptions:{
    backgroundColor: '#F6F7FB',
    fontSize: 16,
    borderRadius: 10,
    
    paddingBottom:50,
    height: 50,
    marginBottom: 20,
    
  }
})
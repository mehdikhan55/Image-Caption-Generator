import { View, Text, TouchableOpacity, Image, Button, TextInput, SafeAreaView, Alert, StyleSheet, KeyboardAvoidingView } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { validateEmail } from '../utils';
import { ImageBackground } from 'react-native';

const primary = 'rgb(214, 163, 21)';
const disPrimary = 'rgba(214, 163, 21,0.5)';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [showPassWarning, setShowPassWarning] = useState(false);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [])

  const handleLogin = () => {
    if (validateEmail(email) && password.length >= 8) {
      setIsDisabled(false);
      signInWithEmailAndPassword(auth, email, password)
        .then(() => console.log('User signed in!'))
        .catch((error) => Alert.alert("Invalid Email or Password"));
    } else {
      setIsDisabled(true);
    }
  };



  return (
    <ImageBackground source={require('../img/back-neon.png')} resizeMode='cover' style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        <View style={styles.img}>
          <Image source={require('../img/my-icon.png')} style={{ height: 150, width: 150 }} />
        </View>

        <View style={styles.whiteSheet}>
          <SafeAreaView style={styles.form}>
            <KeyboardAvoidingView>

              {/* <Text style={styles.title}>Login</Text> */}
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setIsDisabled(!validateEmail(text) || password.length < 8);
                  setShowEmailWarning(!validateEmail(text) && text!='');
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
                  setIsDisabled(!validateEmail(text) && text.length < 8);
                  setShowPassWarning(text!='' && text.length < 8);
                }}
                autoCapitalize='none'
                textContentType='password'
                autoCorrect={false}
                secureTextEntry={true}
              />
              {showPassWarning && <Text style={styles.warning}> * Choose strong password, at least 8 characters long</Text>}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isDisabled}
                style={[styles.button, { backgroundColor: isDisabled ? disPrimary : primary }]}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
              <Text style={{ color: 'white' }}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                <Text style={{ color: 'aqua' }}> Sign up</Text>
              </TouchableOpacity>
            </View>

          </SafeAreaView>


        </View>
      </SafeAreaView>
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
    fontSize:11,
    color:'red',
    marginTop:-18,
    marginBottom:10,
  }
})
import { View, Text, TouchableOpacity, Image, Button, TextInput, SafeAreaView, Alert, StyleSheet, KeyboardAvoidingView } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';



export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  })

  const handleSignup = () => {
    if (email !== '' && password !== '') {
      
        createUserWithEmailAndPassword(auth, email, password)
        .then(()=> console.log('User signed up!'))
        .catch((error) => {
          alert(error.message);
        console.log('Error signing up: ', error);
        }
        );
    
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.back} />
      <View style={styles.whiteSheet}>

        <SafeAreaView style={styles.form}>
          <KeyboardAvoidingView>

            <Text style={styles.title}>Sign Up!</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              autoCapitalize='none'
              keyboardType='email-address'
              textContentType='emailAddress'
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              value={password}
              onChangeText={text => setPassword(text)}
              autoCapitalize='none'
              textContentType='password'
              autoCorrect={false}
              secureTextEntry={true}
            />
          </KeyboardAvoidingView>
          <TouchableOpacity onPress={handleSignup} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('login')}>
              <Text style={{ color: 'blue' }}>Login</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>


      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'orange',
    alignSelf: 'center',
    paddingBottom: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  back: {
    flex: 0.25,
    height: 100,
    backgroundColor: 'black',
  },
  whiteSheet: {
    width: '100%',
    flex: 1,
    backgroundColor: 'lightblue',
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
  button:{
    backgroundColor: 'black',
    paddingHorizontal:20,
    paddingVertical:10,
    borderRadius:10,
    
  },
  buttonText:{
    textAlign:'center',
    fontWeight: 'bold',
    fontSize: 20,
    color:'white',

  }
})
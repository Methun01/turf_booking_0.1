import React, { useState } from "react";
import { Text, TextInput, Alert, View, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import the utility function
import { useNavigation } from '@react-navigation/native';
const LoginScreen = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const Login = () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Login Failed', 'Please fill out all fields');
      return;
    }

    fetch('http://192.168.186.141:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.error) {
          Alert.alert('Login Failed', data.error);
        } else {
          await AsyncStorage.setItem('loginstatus', "Verified"); // Use the utility function
          navigation.navigate('Location');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Alert.alert('Login Failed', 'An error occurred');
      });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        returnKeyType="next"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        onChangeText={(text) => setPassword(text)}
        onSubmitEditing={Login}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={Login}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#00A36C',
    backgroundColor: 'transparent',
    borderWidth: 0.9,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00A36C',
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
  },
});

export default LoginScreen;

import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

const Verify = ({ navigation }) => {
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const signuptoken = await AsyncStorage.getItem('signupstatus');
        const logintoken = await AsyncStorage.getItem('loginstatus');
        const locationtoken = await AsyncStorage.getItem('locationstatus');
        if ((signuptoken && logintoken) || !locationtoken) {
          navigation.replace('Location'); 
        } 
        if (locationtoken) {
            navigation.replace('MainApp'); 
            }
        else {
          navigation.replace('AuthScreen'); // Navigate to AuthScreen if login token is missing
        }
      } catch (error) {
        console.error('Error retrieving user token:', error);
      }
    };

    checkAuthStatus();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default Verify;

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './SplashScreen';
import SignupScreen from './Screens/Signup';
import MainApp from './MainScreen';
import LocationDetails from './LocationDetails';
import BookingScreen from './Screens/Booking';
import Details from './Details';
import BookingDetails from './FormDetails';
import AccountPage from './Account';
import Location from './LocationPage';
import AuthScreen from './AuthScreen';
import Verify from './Verify';

const Stack = createStackNavigator();

const App = () => {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const simulateLoading = async () => {
  //     setTimeout(() => {
  //       setIsLoading(false);
  //     }, 1000); // Simulate splash screen delay
  //   };

  //   simulateLoading();
  // }, []);

  // if (isLoading) {
  //   return <SplashScreen />;
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}} />
        <Stack.Screen name="Verify" component={Verify} options={{ headerShown: false }} />
        <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }} />
        <Stack.Screen name="Location" component={Location} options={{ headerShown: false }} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="BookingDetails" component={BookingDetails} />
        <Stack.Screen name="LocationDetails" component={LocationDetails} />
        <Stack.Screen name="AccountPage" component={AccountPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

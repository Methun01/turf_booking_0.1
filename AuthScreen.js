import * as React from 'react';
import { View, ImageBackground,Dimensions,Text, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import SignupScreen from './Screens/Signup';
import LoginScreen from './LoginScreen';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const renderScene = SceneMap({
  signup: SignupScreen,
  login: LoginScreen,
});

const AuthScreen = ({ navigation }) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'signup', title: 'Sign Up' },
    { key: 'login', title: 'Log In' },
  ]);

  return (
    <View style={{ backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
      <ImageBackground
        source={{
          uri: 'https://w0.peakpx.com/wallpaper/112/776/HD-wallpaper-fon-38626-abstract-android-design-marshmallow-material-thumbnail.jpg',
        }}
        style={{ height: screenHeight + 50, width: screenWidth, justifyContent: 'center', alignItems: 'center' }}>
      
        <View style={styles.formContainer}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get('window').width }}
            style={{marginHorizontal: 15,marginLeft:20}}
            renderTabBar={props => (
              <TabBar
                {...props}
                style={{ backgroundColor: 'white',elevation:0}}
                labelStyle={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}
                pressColor='transparent'
                pressOpacity={1}
                indicatorStyle={{ backgroundColor: 'red', height: 3}}
                renderLabel={({ route, focused, color }) => (
                  <Text style={{ color: focused? 'red' : 'black', fontWeight: 'bold' }}>
                    {route.title}
                  </Text>
                )}
              />
            )}
          />
          </View>
          </ImageBackground>
        </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
    formContainer: {
      backgroundColor: 'white',
      borderRadius: 10,
      paddingVertical: 20,
      justifyContent: 'center',
      marginHorizontal: 110,
      height: 400,
    //   width:'90%'
    //   width: Dimensions.get('window').width * 0.9,
    },

    });
import React, { useState,useEffect } from "react";
import { FontAwesome, FontAwesome5, FontAwesome6, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Image,View, TouchableOpacity, ImageBackground, Dimensions, StyleSheet, TextInput, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const locations = [
  { id: '1', name: 'New York', icon: 'location' },
  { id: '2', name: 'Los Angeles', icon: 'location' },
  { id: '3', name: 'Chicago', icon: 'location' },
  { id: '4', name: 'Houston', icon: 'location' },
  { id: '5', name: 'Phoenix', icon: 'location' },
  // Add more locations as needed
];

const MainApp = () => {
  // const { username,location,email } = route.params;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  // const [searchText, setSearchText] = useState('');
  // const [filteredLocations, setFilteredLocations] = useState([]);
  const [showLogout, setShowLogout] = useState(false);
  const navigation = useNavigation();
  
  // const toggleSearch = () => {
  //   setIsSearchVisible(!isSearchVisible);
  // };

  // const handleSearch = (text) => {
  //   setSearchText(text);
  //   if (text) {
  //     const filtered = locations.filter(location =>
  //       location.name.toLowerCase().includes(text.toLowerCase())
  //     );
  //     setFilteredLocations(filtered);
  //   } else {
  //     setFilteredLocations([]);
  //   }
  // };

  useEffect(() => {
    const getUserCredits = async () => {
        try {
            const userCredits = await AsyncStorage.getItem('usercredits');
            const location = await AsyncStorage.getItem('Livelocation');
            if (userCredits !== null) {
                const { username, email } = JSON.parse(userCredits);
                setUsername(username);
                setEmail(email);
                setLocation(location);
            }
        } catch (error) {
            console.error('Failed to load user credits', error);
        }
    };

    getUserCredits();
  }, []);

  const formdetails = () => {
    navigation.navigate('LocationDetails',{location});
  };
  const navigatetolocation = () => {
    navigation.navigate('Location',{username,email});
  };
  const navigateToSignup = () => {

    navigation.navigate('AuthScreen');
  };
  const navigateToAccount = () => {
    console.log('Its username:',username);
    navigation.navigate('AccountPage',{username,email});
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#000', height: screenHeight - 50, width: screenWidth }}>
      <ImageBackground
        source={{
          uri:
            'https://w0.peakpx.com/wallpaper/941/855/HD-wallpaper-football-field-aerial-view-trees-playground-green.jpg',
        }}
        style={{ height: screenHeight + 50, width: screenWidth }}>
{/* 
        <View style={styles.headerContainer}>
          {isSearchVisible ? (
            <TextInput
              style={{ fontSize: 24, padding: 6, marginLeft: 10, flex: 1, fontWeight: 'bold', color: '#000' }}
              value={searchText}
              onChangeText={handleSearch}
              placeholder="Search..."
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.headerText}>TURF BOOKING</Text>
          )}
          <TouchableOpacity onPress={toggleSearch} style={styles.iconContainer}>
            <FontAwesome name="search" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {isSearchVisible && (
          <FlatList
            data={filteredLocations}
            keyExtractor={item => item.id}
            style={styles.suggestionsList}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleLocationPress(item)} style={styles.suggestionItem}>
                <Ionicons name={item.icon} size={24} color="black" style={{ marginRight: 10 }} />
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )} */}
        <View style={{ flexDirection: 'row', justifyContent: 'left', alignItems: 'left', marginTop: 40 }}>
        <Ionicons name={'location'} size={24} color="black" style={{ color:'white' }} />
        <Text style={{ color: '#fff', marginLeft:10,fontSize: 20, fontWeight: 'bold', textAlign: 'left'}} onPress={navigatetolocation}>{location}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', padding: 30 ,marginTop:60}}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: 'white' }}>Welcome to Turf Booking</Text>
          <Text style={{ color: '#fff', fontSize: 15, marginBottom: 10, fontFamily: 'sans-serif', textAlign: 'center' }}>Book your turf online and get the best experience</Text>
          <Text style={{ color: '#fff', fontSize: 15, marginBottom: 20, fontFamily: 'sans-serif', textAlign: 'center' }}>Get the best offers and discounts</Text>
          <TouchableOpacity>
            <Text style={{ color: '#000', backgroundColor: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 15, padding: 16, borderRadius: 20, marginBottom: 10 }} onPress={formdetails}>Book Now</Text>
          </TouchableOpacity>
          {/* 
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 10, padding: 30 }} >
                <FontAwesome6 name="clock" size={24} color="black" style={{ textAlign: 'center', paddingBottom: 5 }} />
                <Text style={{ fontSize: 16, color: '#2135eb', fontWeight: 'bold', textAlign: 'center' }}>
                  Timing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 10, padding: 30, marginVertical: 20, marginHorizontal: 20 }} >
                <FontAwesome5 name="inbox" size={24} color="black" style={{ textAlign: 'center', paddingBottom: 5 }} />
                <Text style={{ fontSize: 16, color: '#2135eb', fontWeight: 'bold', textAlign: 'center' }}>Sq Feet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 10, padding: 30 }} >
                <Feather name="cloud-rain" size={24} color="black" style={{ textAlign: 'center', paddingBottom: 5 }} />
                <Text style={{ fontSize: 16, color: '#2135eb', fontWeight: 'bold', textAlign: 'center' }}>RainPlay</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 10, padding: 30 }} >
                <Ionicons name="football-outline" size={24} color="black" style={{ textAlign: 'center', paddingBottom: 5 }} />
                <Text style={{ fontSize: 16, color: '#2135eb', fontWeight: 'bold', textAlign: 'center' }}>Football</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 10, padding: 30, marginVertical: 20, marginHorizontal: 20 }} >
                <MaterialCommunityIcons name="cricket" size={24} color="black" style={{ textAlign: 'center', paddingBottom: 5 }} />
                <Text style={{ fontSize: 16, color: '#2135eb', fontWeight: 'bold', textAlign: 'center' }}>Cricket</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 10, padding: 30 }} >
                <MaterialCommunityIcons name="kabaddi" size={24} color="black" style={{ textAlign: 'center', paddingBottom: 5 }} />
                <Text style={{ fontSize: 16, color: '#2135eb', fontWeight: 'bold', textAlign: 'center' }}>Kabbadi</Text>
              </TouchableOpacity>
            </View>
          </View> */}
 
        </View>

        {showLogout && (
          <TouchableOpacity onPress={navigateToAccount}>
            <Text style={[styles.logout,styles.newheight]}>Account</Text>
          </TouchableOpacity>)}
        {showLogout && (
          <TouchableOpacity onPress={navigateToSignup}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>)}
        <View style={{ backgroundColor: 'white', padding: 16,paddingBottom:60 }}>
          <TouchableOpacity >
            <Text style={{ color: '#000', fontWeight: 'bold', borderWidth: 0,textAlign:'right'}} onPress={() => setShowLogout(!showLogout)}>{username}</Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    marginTop: 35,
    padding: 7.5,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: 'white',
    position: 'relative'
  },
  headerText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 4,
    marginLeft: 70,
  },
  textInput: {
    flex: 1,
    color: '#000',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
  },
  iconContainer: {
    backgroundColor: 'gray',
    position: 'absolute',
    right: 12,
    marginTop: 5,
    borderRadius: 25,
    padding: 12,
    // marginLeft:36,
    paddingLeft: 13.5,
    paddingRight: 13.5
  },
  suggestionsList: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 100,  // Adjust based on your layout
    width: '97%',
    borderRadius: 20,
    marginLeft: 5,
    borderStartEndRadius: 20,
    zIndex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  suggestionText: {
    fontSize: 18,
    color: '#000',
  }, 
  logout: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 8,
    marginRight:8,
    backgroundColor: 'white',
    borderRadius: 10,
    marginStart:310,
    padding:10,
    textAlign:'center'
  },
  newheight:{
    marginTop:10
  }
});

export default MainApp;

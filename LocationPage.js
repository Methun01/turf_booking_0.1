import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocationAPI from 'expo-location';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


const locations = [
    { id: '1', name: 'Ariyalur', icon: 'location' },
    { id: '2', name: 'Chengalpattu', icon: 'location' },
    { id: '3', name: 'Chennai', icon: 'location' },
    { id: '4', name: 'Coimbatore', icon: 'location' },
    { id: '5', name: 'Cuddalore', icon: 'location' },
    { id: '6', name: 'Dharmapuri', icon: 'location' },
    { id: '7', name: 'Dindigul', icon: 'location' },
    { id: '8', name: 'Erode', icon: 'location' },
    { id: '9', name: 'Kallakurichi', icon: 'location' },
    { id: '10', name: 'Kancheepuram', icon: 'location' },
    { id: '11', name: 'Karur', icon: 'location' },
    { id: '12', name: 'Krishnagiri', icon: 'location' },
    { id: '13', name: 'Madurai', icon: 'location' },
    { id: '14', name: 'Mayiladuthurai', icon: 'location' },
    { id: '15', name: 'Nagapattinam', icon: 'location' },
    { id: '16', name: 'Kanniyakumari', icon: 'location' },
    { id: '17', name: 'Namakkal', icon: 'location' },
    { id: '18', name: 'Perambalur', icon: 'location' },
    { id: '19', name: 'Pudukkottai', icon: 'location' },
    { id: '20', name: 'Ramanathapuram', icon: 'location' },
    { id: '21', name: 'Ranipet', icon: 'location' },
    { id: '22', name: 'Salem', icon: 'location' },
    { id: '23', name: 'Sivagangai', icon: 'location' },
    { id: '24', name: 'Tenkasi', icon: 'location' },
    { id: '25', name: 'Thanjavur', icon: 'location' },
    { id: '26', name: 'Theni', icon: 'location' },
    { id: '27', name: 'Thoothukudi', icon: 'location' },
    { id: '28', name: 'Tiruchirappalli', icon: 'location' },
    { id: '29', name: 'Tirunelveli', icon: 'location' },
    { id: '30', name: 'Tirupattur', icon: 'location' },
    { id: '31', name: 'Tiruvallur', icon: 'location' },
    { id: '32', name: 'Tiruvannamalai', icon: 'location' },
    { id: '33', name: 'Tiruvarur', icon: 'location' },
    { id: '34', name: 'Vellore', icon: 'location' },
    { id: '35', name: 'Viluppuram', icon: 'location' },
    { id: '36', name: 'Kancheepuram', icon: 'location' }, // Note: Duplicate removed
    { id: '37', name: 'Madras', icon: 'location' },
    { id: '38', name: 'South Arcot', icon: 'location' },
  ];

const Location = ({ navigation }) => {
  const [location, setLocation] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [liveLocation, setLiveLocation] = useState(null); // Store live location data

  // Function to handle location permission request
  const requestLocationPermission = async () => {
    const { status } = await LocationAPI.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      console.log('Location permission granted');
      return true;
    } else {
      console.log('Location permission denied');
      Alert.alert('Location Access Required', 'To use live location, please enable location access in settings.');
      return false;
    }
  };

  // Function to get live location
  const getLiveLocation = async () => {
    if (await requestLocationPermission()) {
      try {
        const location = await LocationAPI.getCurrentPositionAsync({});
        setLiveLocation(location);
      } catch (error) {
        console.error('Error getting live location:', error);
        Alert.alert('Error', 'Failed to retrieve your current location. Please try again.');
      }
    }
  };

  // Function to get district from coordinates using a geocoding API (you'll need to implement this based on your chosen API)
  const getDistrictFromCoordinates = async (latitude, longitude) => {
    // Replace this with your actual geocoding API call and logic
    // Example using Google Maps Geocoding API (you'll need an API key)
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        const district = addressComponents.find(component => component.types.includes('administrative_area_level_2'));
        return district ? district.long_name : null;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching district from coordinates:', error);
      return null;
    }
  };

  useEffect(() => {
    if (liveLocation) {
      // Get district from live location coordinates
      getDistrictFromCoordinates(liveLocation.coords.latitude, liveLocation.coords.longitude)
        .then(district => {
          if (district) {
            setLocation(district);
            setLiveLocation(null); // Clear live location data after using it
          } else {
            Alert.alert('Error', 'Unable to determine district from your location. Please enter manually.');
          }
        });
    }
  }, [liveLocation]);

  // ... (Rest of your code)

  const handleNextPress = async () => {
    if (location) {
      try {
        await AsyncStorage.setItem('locationstatus', "Verified");
        await AsyncStorage.setItem('Livelocation', location);
        navigation.replace('MainApp');
      } catch (error) {
        console.error('Failed to save location', error);
      }
    } else {
      alert('Please fill out all fields');
    }
  };

  const handleItemPress = (item, type) => {
    if (type === 'location') {
      setLocation(item.name);
      setFilteredLocations([]);
    }
  };

  const handleSearch = (text, type) => {
    if (type === 'location') {
      setLocation(text);
      if (text) {
        setFilteredLocations(locations.filter(location =>
          location.name.toLowerCase().includes(text.toLowerCase())
        ));
      } else {
        setFilteredLocations([]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://w0.peakpx.com/wallpaper/112/776/HD-wallpaper-fon-38626-abstract-android-design-marshmallow-material-thumbnail.jpg',
        }}
        style={{ height: screenHeight + 50, width: screenWidth, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Enter Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={text => handleSearch(text, 'location')}
            placeholder="Search Location"
            placeholderTextColor="#888"
          />
          {filteredLocations.length > 0 && (
            <FlatList
              data={filteredLocations}
              keyExtractor={item => item.id}
              style={styles.suggestionsList}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleItemPress(item, 'location')} style={styles.suggestionItem}>
                  <Ionicons name={item.icon} size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={styles.suggestionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity style={styles.buttonContainer} onPress={handleNextPress}>
            <Text style={styles.buttonText}>NEXT</Text>
          </TouchableOpacity>
          <Text style={styles.forOR}>----or----</Text>
          <TouchableOpacity style={styles.buttonContainer} onPress={getLiveLocation}>
            <Text style={styles.buttonText}>Live Location</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 60,
        height: 370,
        width: 300,
        marginBottom: 50,
    },
    title: {
        marginBottom: 20,
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
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
    suggestionsList: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 160,  // Adjust based on your layout
    width: '97%',
    borderRadius: 20,
    marginLeft: 60,
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
    forOR:{
        textAlign:'center',
        fontSize:20,
        color:'gray',
        marginTop:10,
        marginBottom:10
    }
});
  export default Location;
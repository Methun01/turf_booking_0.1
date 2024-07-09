import React, { useState, useCallback,useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const games = [
  { id: '1', name: 'Cricket', icon: 'sports-cricket', iconType: 'MaterialIcons' },
  { id: '2', name: 'Baseball', icon: 'baseball-ball', iconType: 'FontAwesome5' },
  { id: '3', name: 'Tennis', icon: 'tennisball', iconType: 'Ionicons' },
  { id: '4', name: 'Football', icon: 'football-ball', iconType: 'FontAwesome5' },
  { id: '5', name: 'Volleyball', icon: 'volleyball-ball', iconType: 'FontAwesome5' },

];

const options = {
  'Salem': [
    {
      url: 'https://content3.jdmagicbox.com/comp/surat/u8/0261px261.x261.190822082231.m2u8/catalogue/l-p-savani-sports-complex-bhatha-surat-sports-clubs-f2rcihthfa.jpg',
      info: 'Salem Turf Station',
      time: '09.00 PM - 11.00 PM',
      games: 'Football, Cricket, Volleyball',
      contact: '1234567890',
     
    },
    {
      url: 'https://www.sportswing.in/wp-content/uploads/2022/03/Sportswing-Football-Turf-Diamond-50mm-150x150.png',
      info: 'Turf Station',
      time: '01.00 AM - 03.00 AM',
      games: 'Football, Cricket, Volleyball',
      contact: '1234567890',
      
    }
  ],
  'Chennai': [
    {
      url: 'https://www.sportswing.in/wp-content/uploads/2022/03/Sportswing-Football-Turf-Diamond-50mm-150x150.png',
      info: 'Chennai Turf Station',
      time: '12.00 PM - 02.00 PM',
      games: 'Football, Cricket, Volleyball, Tennis, Baseball, Tennis, Baseball',
      contact: '1234567890',
     
    }
  ],
  'Erode': [
    {
      url: 'https://content3.jdmagicbox.com/comp/surat/r2/0261px261.x261.190314234616.c1r2/catalogue/turf-park-vesu-surat-sports-turf-grounds-dw2rw86k73.jpg',
      info: 'Erode Turf Station',
      time: '06.00 AM - 05.00 PM',
      games: 'Football, Cricket, Volleyball',
      contact: '1234567890',
      
    }
  ],
  'Madurai': [
    {
      url: 'https://5.imimg.com/data5/SELLER/Default/2022/7/NO/TC/UJ/134008477/football-turf-4-500x500.jpeg',
      info: 'Madurai Turf Station',
      time: '06.00 AM - 05.00 PM',
      games: 'Football, Cricket, Volleyball',
      contact: '1234567890',
      
    }
  ],
  'Coimbatore': [
    {
      url: 'https://playo.gumlet.io/JOGOFOOTBALLLLP/MedellinSportsCity1695065516624.jpg?auto=compress,format&h=300',
      info: 'Coimbatore Turf Station',
      time: '06.00 AM - 05.00 PM',
      games: 'Football, Cricket, Volleyball',
      contact: '1234567890',
      
    }
  ],
};

const renderIcon = (icon, iconType) => {
  switch (iconType) {
    case 'Ionicons':
      return <Ionicons name={icon} size={20} color="black" style={{ textAlign: 'center', paddingBottom: 5 }} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={icon} size={20} color="black" style={{ textAlign: 'center', paddingBottom: 5 }} />;
    case 'MaterialIcons':
      return <MaterialIcons name={icon} size={20} color="black" style={{ textAlign: 'center', paddingBottom: 5 }} />;
    default:
      return null;
  }
};

const Item = ({ item, navigation, location }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -300, // Adjust this value based on the total width of the content
        duration: 10000, // Adjust the duration to control the speed of the scroll
        useNativeDriver: true,
      })
    ).start();
  }, [scrollX]);

  const to_next_page = (image_url, image_title, time, game) => {
    navigation.navigate('BookingDetails', { location, image_url, image_title, time, game });
  };

  return (
    <TouchableOpacity style={styles.detailContainer} onPress={() => to_next_page(item.url, item.info, item.time, item.games)}>
      <Image source={{ uri: item.url }} style={styles.locationImage} />
      <View style={styles.locationInfo}>
        <Text style={{ fontWeight: 'bold', textAlign: 'left', marginLeft: 5, marginVertical: 3 }}>{item.info}</Text>
        <View style={styles.gameDetailsContainer}>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
              <View style={{ marginRight: 5 }}>
                <Ionicons name="time" size={20} color="black" />
              </View>
              <Text style={styles.gameDetails}>{item.time}</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingVertical: 3 }}>
              <View style={{ marginRight: 5 }}>
                <Ionicons name="call" size={18} color="black" />
              </View>
              <Text style={styles.gameDetails}>{item.contact}</Text>
            </View>
            <View style={{ overflow: 'hidden' }}>
              <Text style={{ fontWeight: 'bold', textAlign: 'left', marginLeft: 5, marginVertical: 3 }} >Available Sports</Text>
              <Animated.ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ flexDirection: 'row', paddingVertical: 1 }}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                scrollEnabled={false}
                contentOffset={{ x: -scrollX._value, y: 0 }} // Add this line to start the content from the end
              >
                <Animated.View style={{ flexDirection: 'row', transform: [{ translateX: scrollX }] }}>
                  {item.games.split(',').map((gameName, index) => {
                    const game = games.find(g => g.name.toLowerCase() === gameName.trim().toLowerCase());
                    if (game) {
                      return (
                        <View
                          key={index}
                          style={{
                            borderColor: 'gray',
                            borderWidth: 1,
                            borderRadius: 10,
                            paddingVertical: 4,
                            paddingHorizontal: 20,
                            marginVertical: 3,
                            marginRight: 10,
                          }}
                        >
                          {renderIcon(game.icon, game.iconType)}
                        </View>
                      );
                    }
                    return null;
                  })}
                </Animated.View>
              </Animated.ScrollView>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const GameItem = ({ game, index, renderIcon }) => (
  <View
    key={index}
    style={{
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      height: 70,
      width: 70,
      marginBottom: 10,
      marginRight: 10,
    }}
  >
    {renderIcon(game.icon, game.iconType)}
    <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>
      {game.name}
    </Text>
  </View>
);
const LocationDetails = ({ route, navigation }) => {
  const { location } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.locationName}>{location}</Text>
      <View style={{ flexDirection: 'column', }}>
        <FlatList
          data={games} // Provide the array of game data
          horizontal={true} // Enable horizontal scrolling
          showsHorizontalScrollIndicator={false} // Hide the scroll indicator
          renderItem={({ item, index }) => (
            <GameItem game={item} index={index} renderIcon={renderIcon} />
          )} // Render each game item using the GameItem component
          keyExtractor={(item) => item.id || item.name} // Extract unique keys for items (assuming an 'id' property or using 'name')
        />
      </View>
      <FlatList
        data={options[location]}
        renderItem={({ item }) => (
          <Item item={item} navigation={navigation} location={location} />
        )}
        keyExtractor={(item) => item.info}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  locationName: {
    backgroundColor: 'white',
    padding: 16,
    elevation: 14,
    borderRadius: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 12,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    paddingLeft: 10,
    overflow: 'hidden',
  },
  locationImage: {
    width: '30%',
    height: 105,
    borderRadius: 20,
  },
  locationInfo: {
    width: '70%',
    padding: 10,
    paddingLeft: 20,
    alignItems: 'left',
  },
  gameDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  gameDetails: {
    fontSize: 16,
    color: 'gray',
  },
});

export default LocationDetails;

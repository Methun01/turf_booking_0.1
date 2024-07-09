import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, FlatList, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const BookingDetails = ({ route }) => {
  const { location, image_url, image_title, time, game } = route.params;

  const games = [
    { id: '1', name: 'Cricket', icon: 'sports-cricket', iconType: 'MaterialIcons' },
    { id: '2', name: 'Baseball', icon: 'baseball-ball', iconType: 'FontAwesome5' },
    { id: '3', name: 'Tennis', icon: 'tennisball', iconType: 'Ionicons' },
    { id: '4', name: 'Football', icon: 'football-ball', iconType: 'FontAwesome5' },
    { id: '5', name: 'Volleyball', icon: 'volleyball-ball', iconType: 'FontAwesome5' },
  ];

  const selectedGames = game.split(',').map(g => g.trim().toLowerCase());
  const filteredGames = games.filter(g => selectedGames.includes(g.name.toLowerCase()));

  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'game', title: 'Game' },
    { key: 'date', title: 'Date' },
    { key: 'time', title: 'Time' },
  ]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isCurrentDateSelected, setIsCurrentDateSelected] = useState(false);

  // Function to parse time string and return available time slots
  const parseTime = (time) => {
    let splittedTime = time.split('-');
    let [startTime, startPeriod] = splittedTime[0].trim().split(' ');
    let [endTime, endPeriod] = splittedTime[1].trim().split(' ');

    let [startHour, startMinute] = startTime.split('.');
    let [endHour, endMinute] = endTime.split('.');

    startHour = parseInt(startHour);
    endHour = parseInt(endHour);

    let timeSlots = [];

    // Handle the case where start and end period are different
    if (startPeriod !== endPeriod) {
      // If start period is AM and end period is PM
      if (startPeriod === 'AM' && endPeriod === 'PM') {
        // Add times from start hour to 12 PM
        for (let hour = startHour; hour <= 12; hour = hour + 1) {
          timeSlots.push(`${hour}.00 ${startPeriod}`);
        }
        // Add times from 1.00 PM to end hour
        for (let hour = 1; hour <= endHour; hour = hour + 1) {
          timeSlots.push(`${hour}.00 PM`);
        }
      } else if (startPeriod === 'PM' && endPeriod === 'AM') {
        // Add times from start hour to end hour (spanning across midnight)
        for (let hour = startHour; hour <= 12; hour = hour + 1) {
          timeSlots.push(`${hour}.00 PM`);
        }
        for (let hour = 1; hour <= endHour; hour = hour + 1) {
          timeSlots.push(`${hour}.00 AM`);
        }
      }
    } else {
      // If start period and end period are the same
      for (let hour = startHour; hour !== endHour || (hour === endHour && startPeriod !== endPeriod); hour = hour === 12 ? 1 : hour + 1) {
        timeSlots.push(`${hour}.00 ${startPeriod}`);
        if (hour === 11) {
          startPeriod = startPeriod === 'AM' ? 'PM' : 'AM';
        }
      }
      timeSlots.push(`${endHour}.00 ${endPeriod}`);
    }

    let currentTime = new Date();
    let currentHour = currentTime.getHours();
    let currentMinute = currentTime.getMinutes();
    let currentPeriod = currentHour >= 12 ? 'PM' : 'AM';

    if (currentHour > 12) {
      currentHour -= 12;
    } else if (currentHour === 0) {
      currentHour = 12;
    }

    // Ensure valid time slots when the current date is selected
    if (isCurrentDateSelected) {
      let currentTimeInMinutes = currentHour * 60 + currentMinute + (currentPeriod === 'PM' ? 720 : 0);
      timeSlots = timeSlots.filter((slot) => {
        let [slotHour, slotPeriod] = slot.split(' ');
        slotHour = parseInt(slotHour.split('.')[0]);
        let slotTimeInMinutes = slotHour * 60 + (slotPeriod === 'PM' ? 720 : 0);
        return slotTimeInMinutes > currentTimeInMinutes;
      });
    }

    return timeSlots;
  };

  useEffect(() => {
    const computedTimeSlots = parseTime(time);
    setTimeSlots(computedTimeSlots);
  }, [time, isCurrentDateSelected]);

  const handleTabChange = (index) => {
    setIndex(index);
  };

  const navigation = useNavigation();

  const handleItemPress = (item) => {
    setSelectedGame(item);
  };

  const handleDatePress = (date) => {
    setSelectedDate(date);

    const [month, day] = date.split(' ');
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    const isCurrentDateSelected = new Date(currentYear, currentDate.getMonth(), currentDate.getDate()).toDateString() === new Date(currentYear, selectedMonth, parseInt(day)).toDateString();
    setIsCurrentDateSelected(isCurrentDateSelected);
  };

  // Modified handleStartTimePress to set end time
  const handleStartTimePress = (time) => {
    setSelectedStartTime(time);
    // Find the next time slot after the selected start time
    const nextTimeIndex = timeSlots.findIndex(slot => slot === time) + 1;
    if (nextTimeIndex < timeSlots.length) {
      setSelectedEndTime(timeSlots[nextTimeIndex]);
    } else {
      // If no next time slot, reset end time
      setSelectedEndTime('');
    }
  };

  // Keep the existing handleEndTimePress for manual selection
  const handleEndTimePress = (time) => {
    if (selectedStartTime === '') {
      Alert.alert('Error', 'Select start time first');
    } else {
      const [startTime, startPeriod] = selectedStartTime.split(' ');
      const [endTime, endPeriod] = time.split(' ');

      const startTimeInMinutes = convertTimeToMinutes(startTime, startPeriod);
      const endTimeInMinutes = convertTimeToMinutes(endTime, endPeriod);

      if (endTimeInMinutes <= startTimeInMinutes) {
        Alert.alert('Error', 'Select a valid end time');
      } else {
        setSelectedEndTime(time);
      }
    }
  };

  const convertTimeToMinutes = (time, period) => {
    const [hours, minutes] = time.split('.');
    let hourInMinutes = parseInt(hours) * 60;

    if (period === 'PM' && parseInt(hours) !== 12) {
      hourInMinutes += 12 * 60;
    }

    return hourInMinutes + parseInt(minutes);
  };

  const NextButton = ({ handlePress, index }) => {
    const onPress = () => {
      if (index === 0 && !selectedGame) {
        Alert.alert('Error', 'Please select a game');
        return;
      } else if (index === 1 && !selectedDate) {
        Alert.alert('Error', 'Please select a date');
        return;
      }
      handlePress();
    };

    return (
      <TouchableOpacity style={styles.submitButton} onPress={onPress}>
        <Text style={styles.submitButtonText}>Next</Text>
      </TouchableOpacity>
    );
  };

  const nextpage = () => {
    if (selectedGame && selectedDate && selectedStartTime && selectedEndTime) {
      const [month, day] = selectedDate.split(' ');
      const currentYear = new Date().getFullYear();
      const currentDate = new Date();
      const dateFormatted = `${day}-${month}-${currentYear}`;

      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const currentPeriod = currentHour >= 12 ? 'PM' : 'AM';
      const currentHourIn12HourFormat = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour;

      const [selectedStartHour, selectedStartMinute] = selectedStartTime.split(' ')[0].split('.');
      const selectedStartPeriod = selectedStartTime.split(' ')[1];
      const [selectedEndHour, selectedEndMinute] = selectedEndTime.split(' ')[0].split('.');
      const selectedEndPeriod = selectedEndTime.split(' ')[1];

      const startTimeInMinutes = convertTimeToMinutes(selectedStartTime);
      const endTimeInMinutes = convertTimeToMinutes(selectedEndTime);
      const currentTimeInMinutes = convertTimeToMinutes(`${currentHourIn12HourFormat}.${currentMinute} ${currentPeriod}`);

      // Correctly check for valid time considering PM to AM cases
      if (isCurrentDateSelected) {
        if ((selectedStartPeriod === 'PM' && selectedEndPeriod === 'AM') ||
          (selectedStartPeriod === 'AM' && selectedEndPeriod === 'AM' && selectedEndHour < selectedStartHour)) {
          // Booking time spans PM to AM or AM to AM (but end hour is earlier)
          if (currentTimeInMinutes >= endTimeInMinutes) {
            alert('Choose a valid time');
            return;
          }
        } else {
          // Regular case where booking time does not span across days
          if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
            alert('Choose a valid time');
            return;
          }
        }
      }

      navigation.navigate('Booking', {
        image_url: image_url,
        image_title: image_title,
        game: selectedGame?.name,
        date: dateFormatted,
        time: `${selectedStartTime} - ${selectedEndTime}`
      });
    } else {
      alert("Please fill all the details");
    }
  };

  const renderIcon = (icon, iconType) => {
    const IconComponent = { MaterialIcons, FontAwesome5, Ionicons }[iconType];
    return <IconComponent name={icon} size={40} color="#000" />;
  };

  const renderGameTab = () => (
    <View style={styles.tabContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.gameContainer, { flexWrap: 'wrap' }]}>
        {filteredGames.map((item, index) => (
          <View key={item.id} style={styles.gameItemWrapper}>
            <TouchableOpacity
              onPress={() => handleItemPress(item)}
              style={[
                styles.gameItem,
                { backgroundColor: selectedGame?.id === item.id ? '#ddd' : 'white' }
              ]}
            >
              {renderIcon(item.icon, item.iconType)}
              <Text style={styles.gameText}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <NextButton handlePress={() => handleTabChange(index + 1)} index={0} />
    </View>
  );

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const months = Array.from({ length: 12 - new Date().getMonth() }, (_, index) => {
    const month = new Date(new Date().getFullYear(), new Date().getMonth() + index, 1);
    return {
      label: month.toLocaleString('default', { month: 'short' }),
      value: new Date().getMonth() + index,
    };
  });

  const renderMonthDropdown = () => {
    return (
      <View style={styles.monthDropdownContainer}>
        <FlatList
          data={months}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.monthItem,
                selectedMonth === item.value && styles.selectedMonthItem,
              ]}
              onPress={() => setSelectedMonth(item.value)}
            >
              <Text style={styles.monthText}>{item.label}</Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderDateTab = () => {
    const currentDate = new Date();
    let startDate;
    let endDate;

    if (selectedMonth === currentDate.getMonth()) {
      startDate = currentDate;
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    } else {
      startDate = new Date(currentDate.getFullYear(), selectedMonth, 1);
      endDate = new Date(currentDate.getFullYear(), selectedMonth + 1, 0);
    }

    const dates = Array.from({ length: endDate.getDate() - startDate.getDate() + 1 }, (_, index) => {
      const date = new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000);
      const day = date.toLocaleString('default', { day: '2-digit' });
      const month = date.toLocaleString('default', { month: 'short' });
      return `${month} ${day}`;
    });

    return (
      <View style={styles.tabContainer}>
        {renderMonthDropdown()}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.dateContainer}>
          {dates.map((date, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDatePress(date)}
              style={[
                styles.dateItem,
                { borderColor: selectedDate === date ? 'green' : 'gray' }
              ]}
            >
              <Text style={{ color: selectedDate === date ? 'green' : 'black' }}>{date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <NextButton handlePress={() => handleTabChange(index + 1)} index={1} />
      </View>
    );
  };


  const renderTimeTab = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentPeriod = currentHour >= 12 ? 'PM' : 'AM';
    const currentHourIn12HourFormat = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour;
    const currentTimeInMinutes = timeStringToMinutes(`${currentHourIn12HourFormat}:${currentMinute} ${currentPeriod}`);

    // console.log(`Current Time: ${currentHourIn12HourFormat}:${currentMinute} ${currentPeriod}`);
    // console.log(`Current Time in Minutes: ${currentTimeInMinutes}`);

    const [startTimeStr, endTimeStr] = time.split(' - ');

    const startTimeInMinutes = timeStringToMinutes(startTimeStr);
    let endTimeInMinutes = timeStringToMinutes(endTimeStr);

    if (startTimeStr.includes('PM') && endTimeStr.includes('AM')) {
      endTimeInMinutes += 1440; // Add 24 hours to end time
    }

    // console.log(`Start Time: ${startTimeStr}, End Time: ${endTimeStr}`);
    // console.log(`Start Time in Minutes: ${startTimeInMinutes}, End Time in Minutes: ${endTimeInMinutes}`);

    let isTurfClosed = false;

    if (isCurrentDateSelected) {
      if (startTimeStr.includes('PM') && endTimeStr.includes('AM')) {
        // Booking time spans PM to AM
        isTurfClosed = (currentTimeInMinutes >= endTimeInMinutes && currentPeriod === 'AM') || 
                       (currentTimeInMinutes >= endTimeInMinutes && currentPeriod === 'PM');
      } else {
        // Regular case where booking time does not span across days
        isTurfClosed = currentTimeInMinutes >= endTimeInMinutes;
      }
    }

    // console.log(`Is Turf Closed: ${isTurfClosed}`);

    return (
      <View style={styles.tabContainer}>
        {isTurfClosed || timeSlots.length === 1? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 30, textAlign: 'center' }}>Turf is Closed!</Text>
            <Text style={styles.closedMessage}>Choose Another Date</Text>
          </View>
        ) : (
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.timeSection}>
                <Text style={styles.sectionTitle}>Start Time</Text>
                <View style={styles.timeWrap}>
                  {timeSlots.map((time, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeItem,
                        { borderColor: selectedStartTime === time ? 'green' : 'gray' },
                      ]}
                      onPress={() => handleStartTimePress(time)}
                    >
                      <Text style={{ color: selectedStartTime === time ? 'green' : 'black' }}>{time}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.sectionTitle}>End Time</Text>
                <View style={styles.timeWrap}>
                  {/* Disable end time selection if start time is not set */}
                  {selectedStartTime ? (
                    timeSlots.map((time, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.timeItem,
                          { borderColor: selectedEndTime === time ? 'green' : 'gray' },
                        ]}
                        onPress={() => handleEndTimePress(time)}
                      >
                        <Text style={{ color: selectedEndTime === time ? 'green' : 'black' }}>{time}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={{ color: 'gray', marginLeft:12, marginTop: 10, fontSize: 18 }}>Select start time first</Text>
                  )}
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.submitButton} onPress={nextpage}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  const timeStringToMinutes = (timeStr) => {
    // Replace '.' with ':' to handle the format in the provided time variable
    timeStr = timeStr.replace('.', ':');
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes;
    if (period === 'PM' && hours !== 12) {
      totalMinutes += 720; // Add 12 hours worth of minutes
    }
    if (period === 'AM' && hours === 12) {
      totalMinutes -= 720; // Subtract 12 hours worth of minutes for 12 AM
    }
    return totalMinutes;
  };



  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'game':
        return renderGameTab();
      case 'date':
        return renderDateTab();
      case 'time':
        return renderTimeTab();
      default:
        return null;
    }
  };

  return (
    <View style={{ backgroundColor: 'gray', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <ImageBackground
        source={{
          uri: 'https://w0.peakpx.com/wallpaper/112/776/HD-wallpaper-fon-38626-abstract-android-design-marshmallow-material-thumbnail.jpg',
        }}
        style={{ height: screenHeight + 50, width: screenWidth, justifyContent: 'center', alignItems: 'center' }}>

        <View style={styles.formContainer}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={handleTabChange}
            initialLayout={{ width: Dimensions.get('window').width }}
            renderTabBar={props => (
              <TabBar
                {...props}
                style={{ backgroundColor: 'white', padding: 5 }}
                labelStyle={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}
                indicatorStyle={{ backgroundColor: 'red', height: 4 }}
                renderLabel={({ route, focused, color }) => (
                  <Text style={{ color: focused ? 'red' : 'black', fontWeight: 'bold' }}>
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

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    // padding: 10,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    height: 500,
    width: Dimensions.get('window').width * 0.9,
  },
  gameItemWrapper: {
    width: '50%',
    padding: 10,
  },
  gameContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
  },
  gameItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'green',
    borderWidth: 1,
    // elevation: 10,
    height: 105,
    width: '90%',
    marginLeft: 10,
    // marginTop: 10,
    padding: 20,
    alignItems: 'center',
  },
  gameText: {
    fontSize: 16,
    color: '#2135eb',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 25,
    marginTop: 15,
  },
  dateItem: {
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    elevation: 2,
    marginBottom: 10,
    marginRight: 10,
    padding: 10,
    // margin: 5,
    width: '20%',
    alignItems: 'center',
  },
  timeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginLeft:12,
    textAlign: 'left',
    marginBottom: 10,
  },
  timeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeItem: {
    width: '30%',
    padding: 10,
    margin: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: 'green',
    borderRadius: 10,
    width: "90%",
    alignSelf: 'center',
    padding: 10,
    elevation: 14,
  },
  submitButtonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  monthDropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  monthItem: {
    // padding: 5,
    paddingVertical: 10,
    width: 80,
    marginTop: 20,
    backgroundColor: 'gray',
    // height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedMonthItem: {
    backgroundColor: 'green',
  },
  monthText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closedMessage: {
    color: 'red',
    textAlign: 'center',
    // flex:1,
    // justifyContent:'center',
    // alignItems:'center',
    marginTop: 10,
    fontSize: 16,
  },
});

export default BookingDetails;
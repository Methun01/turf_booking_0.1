import React, { useState, useCallback } from "react";
import { Text, TextInput, Alert, View, StyleSheet, TouchableOpacity, Image, Linking} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";

const AccountPage = ({route}) => {
  const navigation = useNavigation();
  //const {username, email} = route.params;
  const { username: initialUsername, email: initialEmail } = route.params;
  
  const [username, setusername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);

  const [isEditingName, setIsEditingName] = useState(false);
  const [profileImage, setProfileImage] = useState();
  const [isUsernameChanged, setIsUsernameChanged] = useState(false);
  
  const fetchUserData = async () => {
    try {
      console.log('Fetching user data...');
       response = await axios.get('http://192.168.186.141:5000/user-data', {
        params: { email: initialEmail }
      });
      console.log('Response:', response.data);
      if (response.status === 200) {
        const { username, email } = response.data;
        setusername(username);
        setEmail(email);
      } else {
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching user data.');
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [initialEmail])
  );
  
  const handleLogout = async () => {
    await AsyncStorage.removeItem('loginstatus');
    navigation.navigate('AuthScreen');
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to grant permission to access the gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result['assets'][0]['uri'];
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('photo', { uri: localUri, name: filename, type });

      try {
        const uploadResponse = await axios.post('http://192.168.186.141:5000/upload-profile-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (uploadResponse.status === 200) {
          const { uprofileImageUrl } = uploadResponse['data']['profileImageUrl'];

          console.log('------',uploadResponse['data']['profileImageUrl']);
          console.log('------',uprofileImageUrl);
          
          setProfileImage(uprofileImageUrl);
        } else {
          Alert.alert('Error', 'Failed to upload profile image.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while uploading profile image.');
        console.error(error);
      }
    }
  };

  const handlePasswordChange = () => {
    const url = 'https://example.com/change-password'; // Replace with your password change URL
    Linking.openURL(url);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('http://192.168.186.141:5000/update-user', {
        username,
        email,
      }
      
    );

    const userCredits = { username, email };
    AsyncStorage.setItem('usercredits', JSON.stringify(userCredits))
  
      if (response.status === 200) {
        Alert.alert('Success', 'Your profile has been updated.');
        setIsEditingName(false);
        setIsUsernameChanged(false);
      } else {
        Alert.alert('Error', 'Failed to update your profile.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating your profile.');
      console.error(error);
    }
  };

  const handleUsernameChange = (newUsername) => {
    setusername(newUsername);
    setIsUsernameChanged(newUsername !== initialUsername);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleImagePicker}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <Ionicons name="camera" size={30} color="black" style={styles.cameraIcon} />
        </TouchableOpacity>
        {isEditingName ? (
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={handleUsernameChange}
            onSubmitEditing={() => setIsEditingName(false)}
            autoFocus
          />
        ) : (
          <Text style={styles.username}>{username}</Text>
        )}
        <TouchableOpacity style={styles.editIcon} onPress={() => setIsEditingName(!isEditingName)}>
          <Ionicons name="create" size={20} color="grey"/>
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoTextMail}>{email}</Text>
          
          <TouchableOpacity style={styles.editIconMail}>
            <Ionicons name="mail" size={15} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.infoRow} onPress={() => navigation.navigate('Bookings')}>
          <Text style={styles.infoLabel}>Bookings</Text>
          <Text style={styles.infoText}>View Bookings</Text> 
          <Ionicons name="today" size={15} color="black" style={styles.infoTextIcon}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRow} onPress={() => navigation.navigate('Rewards')}>
          <Text style={styles.infoLabel}>Rewards</Text>
          <Text style={styles.infoText}>View Rewards</Text>
          <Ionicons name="cash" size={15} color="black" style={styles.infoTextIcon}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRow} onPress={() => navigation.navigate('HelpSupport')}>
          <Text style={styles.infoLabel}>Help & Support</Text>
          <Text style={styles.infoText}>Get Help</Text>
          <Ionicons name="help-circle" size={17} color="black" style={styles.infoTextIcon}/>
        </TouchableOpacity>
      </View>

      <Text onPress={handlePasswordChange} style={{ color: 'blue', textDecorationLine: 'underline', top: 15, left: 40 }}>
        Click here to change/update your password
      </Text>
      
      {isUsernameChanged && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#20232a',
    shadowColor: 2,
    
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editIcon: {
    position: 'absolute',
    right: 35,
    bottom: 2,
  },
  editIconMail: {
    position: 'absolute',
    right: -10,
  },
  infoTextIcon: {
    position: 'absolute',
    right: -10,
  },
  infoContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: '#555',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    right: 20,
  },
  infoTextMail: {
    fontSize: 16,
    color: '#333',
    right: 20,
  },
  input: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    width: '80%',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccountPage;

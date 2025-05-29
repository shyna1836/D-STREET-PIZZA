import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, ScrollView, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

const aboutText = `D'Street Pizza is a vibrant and community-focused pizzeria dedicated to delivering high-quality, flavorful pizzas made with fresh ingredients. Our mission is to provide a welcoming environment where customers can enjoy delicious, handcrafted pizzas in a friendly and relaxed setting. We offer a diverse menu featuring both classic favorites and innovative creations to satisfy a wide range of tastes. At D'Street Pizza, we prioritize customer satisfaction, quality, and consistency in every slice we serve. Our team is passionate about creating a memorable dining experience and building lasting relationships with our customers and community. Whether dine-in, takeout, or delivery, D'Street Pizza is committed to bringing people together through great food.`;

const Profile = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [aboutVisible, setAboutVisible] = useState(false);

  // For animated slide up effect
  const [aboutBoxTop] = useState(new Animated.Value(0));

  // Load last logged-in user (using lastUserEmail)
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const lastUserEmail = await AsyncStorage.getItem('lastUserEmail');
        const usersData = await AsyncStorage.getItem('users');
        let users = usersData ? JSON.parse(usersData) : [];
        let user = null;
        if (lastUserEmail) {
          user = users.find(u => u.email === lastUserEmail);
        }
        if (!user && users.length > 0) {
          user = users[users.length - 1];
        }
        if (user) {
          setFullName([user.firstName, user.lastName].filter(Boolean).join(" "));
          setEmail(user.email || '');
          setAddress(user.address || '');
          setPhone(user.phone || '');
          setProfilePic(user.profilePic || null);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load user information.');
      }
    }
    fetchUserInfo();
  }, []);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Permission to access gallery is required!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.cancelled) {
      setProfilePic(result.assets ? result.assets[0].uri : result.uri);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('lastUserEmail');
    router.replace('/(shy)');
  };

  const handleToggleAbout = () => {
    // Show/hide about section and animate slightly up when showing
    if (!aboutVisible) {
      setAboutVisible(true);
      Animated.timing(aboutBoxTop, {
        toValue: -30, // adjust value for how high you want it to move up
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(aboutBoxTop, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setAboutVisible(false));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TouchableOpacity style={styles.profilePicContainer} onPress={pickImage}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        ) : (
          <Text style={styles.addPicText}>Add Photo</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={fullName}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        placeholderTextColor="#aaa"
        value={address}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#aaa"
        value={phone}
        editable={false}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.aboutBtn} onPress={handleToggleAbout}>
        <Text style={styles.aboutBtnText}>About Us</Text>
      </TouchableOpacity>
      {aboutVisible && (
        <Animated.View style={[styles.aboutBox, { top: aboutBoxTop }]}>
          <ScrollView
            style={{ maxHeight: 180 }}
            contentContainerStyle={{ paddingVertical: 4 }}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.aboutText}>{aboutText}</Text>
          </ScrollView>
        </Animated.View>
      )}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#000',
      paddingTop: 50,
      paddingHorizontal: 18,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  profilePicContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26,
    borderWidth: 2,
    borderColor: '#ff9900',
    overflow: 'hidden',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
  },
  addPicText: {
    color: '#ff9900',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#181818',
    borderRadius: 8,
    color: '#fff',
    fontSize: 17,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
  },
  aboutBtn: {
    width: '100%',
    backgroundColor: '#ff9900',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  aboutBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  aboutBox: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
    maxHeight: 200,
    position: 'relative', // For Animated top positioning
    zIndex: 10,
  },
  aboutText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  logoutBtn: {
    marginTop: 24,
    width: '100%',
    backgroundColor: '#ff4444',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default Profile; 
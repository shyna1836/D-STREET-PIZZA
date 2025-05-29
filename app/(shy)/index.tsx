import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Text } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

// Import the type for your navigation stack
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define your stack param list
type RootStackParamList = {
  login: undefined;
  signup: undefined;
  profile: undefined;
  
  // add other routes here if needed
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
      source={require('@/assets/images/pizza.png')}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
      resizeMode="cover"
      blurRadius={1}
      />
      <View
      style={{
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#fff8e1',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        marginBottom: 24,
      }}
      >
      <View
        style={{
        width: 180,
        height: 180,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fdf4dc',
        }}
      >
        <Image
        source={require('@/assets/images/logo.png')}
        style={{
          width: 240,
          height: 240,
          borderRadius: 70,
        }}
        resizeMode="cover"
        />
      </View>
      </View>
      <View style={{ marginTop: 32, width: '80%', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <TouchableOpacity
        style={{
          backgroundColor: '#ff6347',
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 32,
          marginBottom: 8,
        }}
        onPress={() => {
          navigation.navigate('login');
        }}
        >
        <Text
          style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
        >
          Log In
        </Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 32,
          borderWidth: 1,
          borderColor: '#ff6347',
          marginBottom: 8,
        }}
        onPress={() => {
          navigation.navigate('signup');
        }}
        >
        <Text style={{ color: '#ff6347', fontWeight: 'bold', fontSize: 16 }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

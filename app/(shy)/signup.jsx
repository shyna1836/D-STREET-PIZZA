import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');

    const isFormValid =
        email &&
        firstName &&
        lastName &&
        password &&
        confirmPassword &&
        phone &&
        address &&
        password === confirmPassword &&
        agreeTerms;

    const register = async () => {
        if (!isFormValid) {
            setError('Please fill all fields correctly and agree to the terms.');
            return;
        }
        try {
            const usersData = await AsyncStorage.getItem('users');
            let users = usersData ? JSON.parse(usersData) : [];
            if (users.find(u => u.email === email)) {
                setError('User already exists with this email');
                return;
            }
            users.push({
                email,
                firstName,
                lastName,
                password,
                phone,
                address,
            });
            await AsyncStorage.setItem('lastUserEmail', email);
            await AsyncStorage.setItem('users', JSON.stringify(users));
            setError('');
            Alert.alert('Registration Successful', 'Account created! Please log in.', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('login', { email, password }),
                },
            ]);
            setEmail('');
            setFirstName('');
            setLastName('');
            setPassword('');
            setConfirmPassword('');
            setPhone('');
            setAddress('');
            setAgreeTerms(false);
        } catch (error) {
            setError('Registration Failed. Please try again.');
        }
    };

    const toLoginPage = () => {
        navigation.navigate('login');
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: 'white', marginBottom: 40 }]}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 300 }}>
                <TextInput
                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                    placeholder="First Name"
                    autoCapitalize="words"
                    autoCorrect={false}
                    placeholderTextColor="gray"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    style={[styles.input, { flex: 1, marginRight: 0 }]}
                    placeholder="Last Name"
                    autoCapitalize="words"
                    autoCorrect={false}
                    placeholderTextColor="gray"
                    value={lastName}
                    onChangeText={setLastName}
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="gray"
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="gray"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number (+63)"
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="gray"
                value={phone}
                onChangeText={setPhone}
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor="gray"
                value={address}
                onChangeText={setAddress}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10, width: 300 }}>
                <TouchableOpacity
                    onPress={() => setAgreeTerms(!agreeTerms)}
                    style={{
                        width: 24,
                        height: 24,
                        borderWidth: 1,
                        borderColor: 'gray',
                        borderRadius: 4,
                        backgroundColor: agreeTerms ? '#ff9900' : 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 8,
                    }}
                >
                    {agreeTerms && (
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>✓</Text>
                    )}
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 14 }}>
                    I Agree to the Policy, Terms, and Conditions
                </Text>
            </View>
            {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}
            <TouchableOpacity
                style={{
                    backgroundColor: isFormValid ? '#ff9900' : '#ccc',
                    paddingVertical: 12,
                    paddingHorizontal: 40,
                    borderRadius: 5,
                    marginTop: 10,
                    alignItems: 'center',
                    width: 300,
                }}
                onPress={register}
                disabled={!isFormValid}
            >
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Create Account</Text>
            </TouchableOpacity>
            <Text
                style={{
                    color: 'white',
                    marginTop: 30,
                    fontSize: 14,
                    alignSelf: 'center',
                }}
            >
                Already have an account?{' '}
                <Text
                    style={{ color: '#ff9900', fontWeight: 'bold' }}
                    onPress={toLoginPage}
                >
                    Log In
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 20,
        width: 300,
        backgroundColor: 'white',
        fontSize: 16,
        fontStyle: 'Arial',
        color: 'black',
    },
});

export default Signup;
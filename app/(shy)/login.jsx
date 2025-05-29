import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const login = async () => {
        try {
            const usersData = await AsyncStorage.getItem('users');
            const users = usersData ? JSON.parse(usersData) : [];
            const user = users.find(
                u => u.email === email && u.password === password
            );
            if (user) {
                setError('');
                // Show basic confirmation, then navigate to menu.tsx
                Alert.alert(
                    'Login Successful',
                    `Welcome, ${user.firstName}!`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                router.replace('/menu'); // Expo Router navigation to menu.tsx
                                setEmail('');
                                setPassword('');
                            }
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            setError('Login Failed. Please try again.');
        }
    };

    const handleSignUp = () => {
        router.push('/signup');
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        Alert.alert(
            'Confirm Reset',
            'Are you sure you want to reset your password?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            const usersData = await AsyncStorage.getItem('users');
                            const users = usersData ? JSON.parse(usersData) : [];
                            const userIndex = users.findIndex(u => u.email === email);
                            if (userIndex !== -1) {
                                users[userIndex].password = newPassword;
                                await AsyncStorage.setItem('users', JSON.stringify(users));
                                Alert.alert('Success', 'Password has been reset successfully');
                                setShowResetPassword(false);
                                setNewPassword('');
                                setConfirmPassword('');
                            } else {
                                Alert.alert('Error', 'User  not found');
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to reset password');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log In</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                autoComplete="email"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            {error ? (
                <Text style={{ color: 'red', marginBottom: 10, alignSelf: 'center' }}>{error}</Text>
            ) : null}
            <Text
                style={styles.forgotText}
                onPress={() => {
                    setShowResetPassword(prev => !prev); // Toggle the visibility
                    if (!showResetPassword) {
                        setNewPassword('');
                        setConfirmPassword('');
                    }
                }}
            >
                Forgot Password?
            </Text>
            {showResetPassword && (
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        placeholderTextColor="#aaa"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        placeholderTextColor="#aaa"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={{
                            backgroundColor: (newPassword && confirmPassword) ? '#ff9900' : '#ccc',
                            paddingVertical: 12,
                            paddingHorizontal: 125,
                            borderRadius: 5,
                            alignItems: 'center',
                            marginTop: 10,
                        }}
                        onPress={handleResetPassword}
                        disabled={!newPassword || !confirmPassword}
                    >
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Reset Password</Text>
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity
                style={{
                    backgroundColor: (email && password) ? '#ff9900' : '#ccc',
                    paddingVertical: 12,
                    paddingHorizontal: 125,
                    borderRadius: 5,
                    alignItems: 'center',
                    marginTop: 10,
                }}
                onPress={login}
                disabled={!email || !password}
            >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Log In</Text>
            </TouchableOpacity>
            <Text
                style={{
                    color: 'white',
                    marginTop: 30,
                    fontSize: 14,
                    alignSelf: 'center',
                }}
            >
                Don’t have an account?{' '}
                <Text
                    style={{ color: '#ff9900', fontWeight: 'bold' }}
                    onPress={handleSignUp}
                >
                    Sign Up
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        color: 'white',
        alignSelf: 'center'
    },
    input: {
        height: 40,
        width: 300,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 20,
        paddingHorizontal: 20,
        color: 'black',
        backgroundColor: '#fffff7',
        fontSize: 16,
    },
    forgotText: {
        color: '#00f',
        textDecorationLine: 'underline',
        alignSelf: 'flex-end',
        marginRight: 10,
        marginBottom: 20,
        fontSize: 14,
    }
});

export default Login;
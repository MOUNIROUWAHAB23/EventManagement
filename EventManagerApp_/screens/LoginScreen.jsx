// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../api/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const data = await loginUser(email, password);
      if (data?.token) {
        await AsyncStorage.setItem('token', data.token);  // ✅ Enregistre le token
        await AsyncStorage.setItem('userId', data.user._id); // <-- AJOUTE CETTE LIGNE
        navigation.replace('HomeStack');
      } else {
        setError(data.message || 'Erreur lors de la connexion');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur réseau');
    }
  };

  return (
    <LinearGradient colors={['#34185F', '#000000']} style={styles.container}>
      <Image source={require('../assets/event_banner.jpg')} style={styles.banner} blurRadius={2} />
      <Text style={styles.title}>Connexion</Text>
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#ccc"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor="#ccc"
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>
        Pas encore de compte ?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          S'inscrire
        </Text>
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  banner: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    opacity: 0.4,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: 280,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    paddingHorizontal: 16,
    color: '#fff',
    marginVertical: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 280,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
  },
  button: {
    width: 280,
    height: 48,
    backgroundColor: '#FF0080',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  subtitle: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 14,
  },
  link: {
    color: '#FF0080',
    fontWeight: 'bold',
  },
});

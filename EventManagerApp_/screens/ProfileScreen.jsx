import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://10.0.2.2:5000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data.user || data);
        else Alert.alert('Erreur', data.message || 'Impossible de charger le profil');
      } catch (e) {
        Alert.alert('Erreur', "Impossible de charger le profil");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={['#4B217F', '#16002B']} style={styles.container}>
        <ActivityIndicator color="#fff" size="large" />
      </LinearGradient>
    );
  }

  if (!user) {
    return (
      <LinearGradient colors={['#4B217F', '#16002B']} style={styles.container}>
        <Text style={{ color: '#fff' }}>Utilisateur non trouvé.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#4B217F', '#16002B']} style={styles.container}>
      {/* Avatar et bouton modifier */}
      <View style={styles.avatarContainer}>
        <Image
          source={require('../assets/event_banner.jpg')}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editContainer}>
          <Text style={styles.editIcon}>✎</Text>
          <Text style={styles.editText}>Modifier</Text>
        </TouchableOpacity>
      </View>
      {/* Nom */}
      <Text style={styles.header}>{user.name?.toUpperCase() || ''}</Text>
      {/* Formulaire */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>NOM COMPLET :</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{user.name}</Text>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>EMAIL :</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{user.email}</Text>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>MOTS DE PASSE :</Text>
        <View style={styles.inputBoxRow}>
          <Text style={styles.inputText}>**********</Text>
          <TouchableOpacity style={styles.changeBtn}>
            <Text style={styles.changeText}>Changer</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Gros bouton modifier */}
      <TouchableOpacity style={styles.modifyBtn}>
        <Text style={styles.modifyText}>MODIFIER</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingBottom: 2,
  },
  editIcon: {
    color: '#fff',
    fontSize: 15,
    marginRight: 4,
  },
  editText: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 15,
    textDecorationLine: 'none',
  },
  header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 28,
    letterSpacing: 1,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputBox: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    justifyContent: 'center',
  },
  inputBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    justifyContent: 'space-between',
  },
  inputText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  changeBtn: {},
  changeText: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modifyBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'center',
  },
  modifyText: {
    color: '#16002B',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});
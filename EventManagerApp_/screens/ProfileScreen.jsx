import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserProfile } from '../api/api';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);

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
        if (res.ok) {
          setUser(data.user || data);
          setForm({
            name: (data.user || data).name || '',
            email: (data.user || data).email || '',
            password: '',
          });
        } else {
          Alert.alert('Erreur', data.message || 'Impossible de charger le profil');
        }
      } catch (e) {
        Alert.alert('Erreur', "Impossible de charger le profil");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      const res = await updateUserProfile(payload);
      if (res.user) {
        setUser(res.user);
        setEditMode(false);
        setForm({ ...form, password: '' });
        Alert.alert('Succès', 'Profil mis à jour');
      } else {
        Alert.alert('Erreur', res.message || 'Erreur lors de la mise à jour');
      }
    } catch (e) {
      Alert.alert('Erreur', "Impossible de mettre à jour le profil");
    }
    setSaving(false);
  };

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
        {!editMode && (
          <TouchableOpacity style={styles.editContainer} onPress={() => setEditMode(true)}>
            <Text style={styles.editIcon}>✎</Text>
            <Text style={styles.editText}>Modifier</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Nom */}
      <Text style={styles.header}>{form.name?.toUpperCase() || ''}</Text>
      {/* Formulaire */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>NOM COMPLET :</Text>
        {editMode ? (
          <TextInput
            style={styles.inputBox}
            value={form.name}
            onChangeText={v => setForm({ ...form, name: v })}
            placeholder="Nom"
            placeholderTextColor="#ccc"
          />
        ) : (
          <View style={styles.inputBox}>
            <Text style={styles.inputText}>{user.name}</Text>
          </View>
        )}
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>EMAIL :</Text>
        {editMode ? (
          <TextInput
            style={styles.inputBox}
            value={form.email}
            onChangeText={v => setForm({ ...form, email: v })}
            placeholder="Email"
            placeholderTextColor="#ccc"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        ) : (
          <View style={styles.inputBox}>
            <Text style={styles.inputText}>{user.email}</Text>
          </View>
        )}
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>MOT DE PASSE :</Text>
        {editMode ? (
          <TextInput
            style={styles.inputBox}
            value={form.password}
            onChangeText={v => setForm({ ...form, password: v })}
            placeholder="Nouveau mot de passe"
            placeholderTextColor="#ccc"
            secureTextEntry
          />
        ) : (
          <View style={styles.inputBoxRow}>
            <Text style={styles.inputText}>**********</Text>
            <TouchableOpacity style={styles.changeBtn} onPress={() => setEditMode(true)}>
              <Text style={styles.changeText}>Changer</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Boutons */}
      {editMode ? (
        <TouchableOpacity style={styles.modifyBtn} onPress={handleSave} disabled={saving}>
          <Text style={styles.modifyText}>{saving ? 'Enregistrement...' : 'ENREGISTRER'}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.modifyBtn} onPress={() => setEditMode(true)}>
          <Text style={styles.modifyText}>MODIFIER</Text>
        </TouchableOpacity>
      )}
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
    color: '#fff',
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
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { getFavorites, removeFavorite } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) return setLoading(false);
    try {
      const data = await getFavorites(token);
      setFavorites(data.favorites || []);
    } catch (e) {
      setFavorites([]);
    }
    setLoading(false);
  };

  const handleRemove = async (eventId) => {
    const token = await AsyncStorage.getItem('token');
    await removeFavorite(token, eventId);
    fetchFavorites();
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const renderFav = ({ item }) => (
    <View style={styles.favRow}>
      <Image source={{ uri: item.imageUrl }} style={styles.favImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.favTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleRemove(item._id)}>
          <Text style={styles.favAction}>Désintéressée</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#34185F', '#000']} style={styles.container}>
      <View style={styles.headerIcon}>
        <Icon name="heart" size={48} color="#FF0080" />
      </View>
      <Text style={styles.header}>MES FAVORIS</Text>
      {loading ? (
        <ActivityIndicator color="#FF0080" size="large" />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item._id}
          renderItem={renderFav}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={<Text style={{ color: '#fff', textAlign: 'center' }}>Aucun favori</Text>}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 16 },
  headerIcon: { alignItems: 'center', marginBottom: 8 },
  header: { color: '#fff', fontWeight: 'bold', fontSize: 22, textAlign: 'center', marginBottom: 16 },
  favRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  favImage: { width: 64, height: 64, borderRadius: 12, marginRight: 12 },
  favTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  favAction: { color: '#FF0080', fontWeight: 'bold', fontSize: 13, marginTop: 6 },
});
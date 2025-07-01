import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getEvents, getFavorites, addFavorite, removeFavorite } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); // Liste des IDs favoris

  // Charger les events et favoris depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getEvents();
        setEvents(Array.isArray(data) ? data : data.events || []);
        // Charger les favoris de l'utilisateur
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const favData = await getFavorites(token);
          setFavorites(favData.favorites ? favData.favorites.map(ev => ev._id) : []);
        }
      } catch (e) {
        setEvents([]);
        setFavorites([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Gérer le toggle favori
  const handleToggleFavorite = async (eventId) => {
 console.log('Toggle fav', eventId, favorites.includes(eventId) ? 'remove' : 'add');
    const token = await AsyncStorage.getItem('token');
  if (!token) return;
  if (favorites.includes(eventId)) {
    const res = await removeFavorite(token, eventId);
    setFavorites(res.favorites ? res.favorites.map(ev => String(ev._id)) : []);
  } else {
    const res = await addFavorite(token, eventId);
    setFavorites(res.favorites ? res.favorites.map(ev => String(ev._id)) : []);
  }
};

  // Mini-cards horizontales (par exemple les 4 premiers events)
  const miniEvents = events.slice(0, 4);

  const renderMiniCard = ({ item }) => (
    <View style={styles.cardSmall}>
      <Image
        source={
          item.imageUrl
            ? { uri: item.imageUrl }
            : require('../assets/default_event.png')
        }
        style={styles.imageSmall}
      />
      <Text style={styles.smallTitle}>{item.title}</Text>
    </View>
  );


  const renderBigCard = ({ item }) => {
const isFav = favorites.includes(String(item._id));
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Event', { event: item, isFav })}>
      <View style={styles.cardBig}>
        <Image
          source={
            item.imageUrl
              ? { uri: item.imageUrl }
              : require('../assets/default_event.png')
          }
          style={styles.imageBig}
        />
        <TouchableOpacity style={styles.heartButton} onPress={() => handleToggleFavorite(item._id)}>
          <Icon name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? "#FF0080" : "#fff"} />
        </TouchableOpacity>
        <Text style={styles.bigTitle}>{item.title}</Text>
        <View style={styles.dateRow}>
          <Icon name="calendar-outline" size={16} color="#fff" />
          <Text style={styles.dateText}>
            {item.date ? new Date(item.date).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#34185F', '#000000']} style={styles.container}>
      {/* Top bar */}
      <View style={styles.topRow}>
        <View style={styles.leftIcons}>
          <TouchableOpacity style={styles.topButton}>
            <Icon name="location-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topButton}>
            <Icon name="calendar-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Icon name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#FF0080" size="large" style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* Horizontal list */}
          <FlatList
            data={miniEvents}
            keyExtractor={(item) => item._id}
            renderItem={renderMiniCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalList}
          />

          {/* Big cards vertical list */}
          <FlatList
            data={events}
            keyExtractor={(item) => item._id}
            renderItem={renderBigCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 8,
    marginRight: 8,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  horizontalList: {
    marginBottom: 16,
  },
  cardSmall: {
    marginRight: 12,
    alignItems: 'center',
  },
  imageSmall: {
    width: 100,
    height: 80,
    borderRadius: 12,
    marginBottom: 4,
  },
  smallTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardBig: {
    marginBottom: 24,
  },
  imageBig: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  bigTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#FF0000',
    fontSize: 14,
    marginLeft: 8,
  },
});
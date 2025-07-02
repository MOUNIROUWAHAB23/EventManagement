import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { addFavorite, removeFavorite } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForEvent } from '../api/api';

export default function EventDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const event = route.params?.event;

  // Pour le bouton favori (optionnel)
  const [isFav, setIsFav] = useState(route.params?.isFav || false);

  if (!event) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <Text style={{ color: '#fff' }}>Aucun événement sélectionné.</Text>
      </View>
    );
  }



  const handleRegister = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');// Ou récupère l'id utilisateur depuis le token ou le contexte
    if (!token || !userId) {
      Alert.alert('Erreur', "Vous devez être connecté.");
      return;
    }
    try {
      // Inscription à l'événement
      const res = await registerForEvent(userId, event._id);
      if (res && res.message === 'Already registered') {
        Alert.alert('Info', "Vous êtes déjà inscrit à cet événement.");
        return;
      }
      Alert.alert('Succès', "Vous êtes inscrit à l'événement !");
      navigation.navigate('Tickets'); // Redirige vers la liste des tickets
    } catch (e) {
      Alert.alert('Erreur', "Impossible de s'inscrire à l'événement.");
    }
  };



  // Gérer le toggle favori (optionnel)
  const handleToggleFavorite = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    try {
      if (isFav) {
        await removeFavorite(token, event._id);
        setIsFav(false);
      } else {
        await addFavorite(token, event._id);
        setIsFav(true);
      }
    } catch (e) {
      Alert.alert('Erreur', "Impossible de mettre à jour les favoris.");
    }
  };

  return (
    <LinearGradient colors={['#34185F', '#000000']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Event image */}
        <Image
          source={
            event.imageUrl
              ? { uri: event.imageUrl }
              : require('../assets/default_event.png')
          }
          style={styles.eventImage}
        />
        <TouchableOpacity style={styles.heartButton} onPress={handleToggleFavorite}>
          <Icon name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? "#FF0080" : "#fff"} />
        </TouchableOpacity>

        {/* Price + Host */}
        <View style={styles.hostPriceRow}>
          <View style={styles.hostBadge}>
            <Text style={styles.hostText}>{event.createdBy?.name || 'Organisateur'}</Text>
          </View>
          {/* Si tu as un champ price, sinon retire cette ligne */}
          {/* <Text style={styles.priceText}>{event.price ? `$ ${event.price}` : ''}</Text> */}
        </View>

        {/* Title */}
        <Text style={styles.eventTitle}>{event.title}</Text>

        {/* Description */}
        <Text style={styles.eventDescription}>{event.description}</Text>

        {/* Date */}
        <View style={styles.infoRow}>
          <Icon name="calendar-outline" size={18} color="#fff" />
          <Text style={styles.infoText}>
            {event.date ? new Date(event.date).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
          </Text>
        </View>

        {/* Address */}
        <View style={styles.infoRow}>
          <Icon name="location-outline" size={18} color="#fff" />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>

        {/* Map fake */}
        <TouchableOpacity style={styles.payButton} onPress={handleRegister}>
          <Image
            source={require('../assets/fake_map.jpg')}
            style={styles.mapImage}
          />
          <Text style={styles.payText}>PAYER MAINTENANT</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  eventImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
  heartButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  hostPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  hostBadge: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hostText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  priceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  eventTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 8,
  },
  eventDescription: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  payButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  mapImage: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    marginBottom: 12,
  },
  payText: {
    backgroundColor: '#fff',
    color: '#000',
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
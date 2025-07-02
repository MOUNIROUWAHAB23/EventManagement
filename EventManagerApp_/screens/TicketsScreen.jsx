import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserRegistrations } from '../api/api';

// Mapping des onglets vers les types backend
const tabToType = {
  'A venir': 'upcoming',
  'En attente': 'pending', // adapte si tu as ce type côté backend
  'Passée': 'past',
};

export default function TicketsScreen() {
  const [activeTab, setActiveTab] = useState('A venir');
  const [tickets, setTickets] = useState([]);
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
      if (storedUserId) {
        const type = tabToType[activeTab] || 'upcoming';
        const data = await getUserRegistrations(storedUserId, type);
        setTickets(data);
      }
    };
    fetchTickets();
  }, [activeTab]);

  const renderTicket = ({ item }) => (
  <TouchableOpacity
    style={styles.ticketCard}
    onPress={() => navigation.navigate('TicketDetail', { ticket: item })}
  >
    <Image
      source={
        item.eventId?.imageUrl
          ? { uri: item.eventId.imageUrl }
          : require('../assets/event_banner.jpg')
      }
      style={styles.ticketImage}
    />
    <View style={{ marginLeft: 10 }}>
      <Text style={styles.ticketTitle}>{item.eventId?.title || 'Événement'}</Text>
      <Text style={styles.ticketDate}>
        {item.eventId?.date
          ? new Date(item.eventId.date).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
          : ''}
      </Text>
    </View>
  </TouchableOpacity>
);

  return (
    <LinearGradient colors={['#34185F', '#000000']} style={styles.container}>
      <Text style={styles.header}>MES BILLETS</Text>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {['A venir', 'En attente', 'Passée'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={tickets}
        keyExtractor={(item) => item._id}
        renderItem={renderTicket}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Aucun billet</Text>}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeTab: {
    textDecorationLine: 'underline',
  },
  ticketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketImage: {
    width: 80,
    height: 60,
    borderRadius: 12,
  },
  ticketTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  ticketDate: {
    color: '#fff',
    fontSize: 12,
  },
});
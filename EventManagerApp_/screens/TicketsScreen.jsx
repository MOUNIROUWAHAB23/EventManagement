// screens/TicketsScreen.js
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function TicketsScreen() {
  const [activeTab, setActiveTab] = useState('A venir');

  const tickets = [
    {
      id: '1',
      title: 'LOREM IPSUM AZERTY AZERTY',
      date: 'Jeu 19 juin 2025',
      image: require('../assets/event_banner.jpg'),
    },
    {
      id: '2',
      title: 'LOREM IPSUM AZERTY AZERTY',
      date: 'Jeu 19 juin 2025',
      image: require('../assets/event_banner.jpg'),
    },
    {
      id: '3',
      title: 'LOREM IPSUM AZERTY AZERTY',
      date: 'Jeu 19 juin 2025',
      image: require('../assets/event_banner.jpg'),
    },
  ];

  const renderTicket = ({ item }) => (
    <View style={styles.ticketCard}>
      <Image source={item.image} style={styles.ticketImage} />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <Text style={styles.ticketDate}>{item.date}</Text>
      </View>
    </View>
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
        keyExtractor={(item) => item.id}
        renderItem={renderTicket}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
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

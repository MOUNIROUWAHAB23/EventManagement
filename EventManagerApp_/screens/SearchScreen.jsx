import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getEvents } from '../api/api';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        const eventList = Array.isArray(data) ? data : data.events || [];
        setEvents(eventList);
        setFilteredEvents(eventList);
      } catch (e) {
        setEvents([]);
        setFilteredEvents([]);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredEvents(events);
    } else {
      const lower = search.toLowerCase();
      setFilteredEvents(
        events.filter(
          ev =>
            ev.title?.toLowerCase().includes(lower) ||
            ev.description?.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, events]);

 const renderEvent = ({ item }) => (
  <TouchableOpacity
    style={styles.eventCard}
    onPress={() => navigation.navigate('Event', { event: item })}
    activeOpacity={0.85}
  >
    <Image
      source={
        item.imageUrl
          ? { uri: item.imageUrl }
          : require('../assets/default_event.png')
      }
      style={styles.eventImage}
    />
    <TouchableOpacity style={styles.heartBtn}>
      <Icon name="heart-outline" size={28} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.eventTitle}>{item.title}</Text>
    <View style={styles.eventRow}>
      <Icon name="calendar-outline" size={16} color="#fff" />
      <Text style={styles.eventDate}>
        {item.date
          ? new Date(item.date).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
          : ''}
      </Text>
    </View>
  </TouchableOpacity>
);

  return (
    <LinearGradient colors={['#34185F', '#000']} style={styles.container}>
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
      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#aaa" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Mots clés, evenement..."
          placeholderTextColor="#ccc"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {/* Filter */}
      <View style={styles.filterRow}>
        <Text style={[styles.filterText, { color: '#fff', fontWeight: 'bold' }]}>Tout</Text>
        <Text style={styles.filterText}>Evenements</Text>
        <Text style={styles.filterText}>Conférence</Text>
      </View>
      {/* Events list */}
      <FlatList
        data={filteredEvents}
        keyExtractor={item => String(item._id)}
        renderItem={renderEvent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>
            Aucun événement trouvé.
          </Text>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 16 },
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#24104D',
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 40,
  },
  searchInput: { flex: 1, color: '#fff' },
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  filterText: { color: '#aaa', marginRight: 18, fontSize: 14 },
  eventCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  eventImage: { width: '100%', height: 140 },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  eventTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 12,
    marginLeft: 12,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    marginTop: 4,
  },
  eventDate: { color: '#FF0000', fontSize: 13, marginLeft: 6 },
});
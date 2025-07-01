import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const notifications = [
  { id: '1', text: 'Lorem ipsum azerty azerty azerty azerty azerty azerty', canDelete: true },
  { id: '2', text: 'Lorem ipsum azerty azerty azerty azerty azerty azerty', canDelete: false },
  { id: '3', text: 'Lorem ipsum azerty azerty azerty azerty azerty azerty', canDelete: false },
];

export default function NotificationsScreen() {
  const renderNotif = ({ item }) => (
    <View style={styles.notifRow}>
      <Text style={styles.notifText} numberOfLines={2}>{item.text}</Text>
      {item.canDelete ? (
        <TouchableOpacity style={styles.deleteBtn}>
          <Icon name="trash-outline" size={20} color="#fff" />
          <Text style={styles.deleteText}>Supprimer</Text>
        </TouchableOpacity>
      ) : (
        <Icon name="eye-off-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
      )}
    </View>
  );

  return (
    <LinearGradient colors={['#34185F', '#000']} style={styles.container}>
      <View style={styles.headerIcon}>
        <Icon name="notifications" size={48} color="#FFD600" />
      </View>
      <Text style={styles.header}>NOTIFICATIONS</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderNotif}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 16 },
  headerIcon: { alignItems: 'center', marginBottom: 8 },
  header: { color: '#fff', fontWeight: 'bold', fontSize: 22, textAlign: 'center', marginBottom: 16 },
  notifRow: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    padding: 12,
    justifyContent: 'space-between',
  },
  notifText: { color: '#fff', flex: 1, fontSize: 14 },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0080',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  deleteText: { color: '#fff', marginLeft: 4, fontWeight: 'bold', fontSize: 13 },
});

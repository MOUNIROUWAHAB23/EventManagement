import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function TicketDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const ticket = route.params?.ticket;
  const event = ticket?.eventId || {};

  return (
    <LinearGradient colors={['#34185F', '#000000']} style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MON TICKET</Text>
        <TouchableOpacity>
          <Icon name="download-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Event image */}
      <Image
        source={
          event.imageUrl
            ? { uri: event.imageUrl }
            : require('../assets/event_banner.jpg')
        }
        style={styles.eventImage}
      />

      {/* QR text */}
      <View style={{ alignItems: 'center', marginVertical: 16 }}>
        <Text style={styles.scanText}>Scanner Moi</Text>
        <Text style={styles.subText}>Profitez De Votre Evenement</Text>
      </View>

      {/* QR code */}
      <Image source={require('../assets/qr_code.png')} style={styles.qrImage} />

      {/* Button */}
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => navigation.navigate('Event', { event })}
      >
        <Text style={styles.viewButtonText}>VOIR L'EVENEMENT</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  scanText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subText: {
    color: '#fff',
    fontSize: 14,
  },
  qrImage: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginVertical: 16,
  },
  viewButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  viewButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

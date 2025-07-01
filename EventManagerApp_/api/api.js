// api/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://10.0.2.2:5000/api";

export const registerUser = async (name, email, password) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const getEvents = async () => {
  const response = await fetch(`${BASE_URL}/event`);
  return response.json();
};

export const registerForEvent = async (userId, eventId) => {
  const response = await fetch(`${BASE_URL}/registration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, eventId }),
  });
  return response.json();
};

// Ajout : auto-injection du token depuis AsyncStorage
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const getFavorites = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${BASE_URL}/favorites`, { headers });
  return response.json();
};

export const addFavorite = async (token, eventId) => {
  console.log('API CALL: POST /favorites', { token, eventId });

  try {
    const response = await fetch(`${BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    });

    const data = await response.json();
    console.log('API RESPONSE:', data);
    return data;
  } catch (error) {
    console.error('API ERROR:', error);
    return { success: false, message: 'Erreur réseau ou serveur' };
  }
};

export const removeFavorite = async (token, eventId) => {
  console.log('API CALL: DELETE /favorites', { token, eventId });

  try {
    const response = await fetch(`${BASE_URL}/favorites/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('API RESPONSE:', data);
    return data;
  } catch (error) {
    console.error('API ERROR:', error);
    return { success: false, message: 'Erreur réseau ou serveur' };
  }
};

export default {
  BASE_URL,
  registerUser,
  loginUser,
  getEvents,
  registerForEvent,
  addFavorite,
  removeFavorite,
  getFavorites,
};

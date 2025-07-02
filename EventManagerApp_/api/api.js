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
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id: userId, eventId }),
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
    return data;
  } catch (error) {
    console.error('API ERROR:', error);
    return { success: false, message: 'Erreur réseau ou serveur' };
  }
};

export const removeFavorite = async (token, eventId) => {
  try {
    const response = await fetch(`${BASE_URL}/favorites/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API ERROR:', error);
    return { success: false, message: 'Erreur réseau ou serveur' };
  }
};

// Fonction pour récupérer les inscriptions/tickets de l'utilisateur
export const getUserRegistrations = async (userId, type = 'upcoming') => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/registration?type=${type}&id=${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const getNotifications = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/notification`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const deleteNotification = async (id) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/notification/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};


// Fonction pour mettre à jour le profil utilisateur
export const updateUserProfile = async (profile) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/user/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  return response.json();
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
  getUserRegistrations,
  getNotifications,
  deleteNotification,
  updateUserProfile,
  getAuthHeaders,
};
import User from '../models/userModel.js';
import Event from '../models/eventModel.js';

export const addFavorite = async (req, res) => {
    console.log('addFavorite called', req.body, req.user?._id || req.user?.id);

  try {
    const user = await User.findById(req.user._id);
    
    
    if (!user.favorites.includes(req.body.eventId)) {
      user.favorites.push(req.body.eventId);
      await user.save();
    }
    // Retourne les favoris peuplés
    const userPopulated = await User.findById(req.user._id).populate('favorites');
    res.json({ favorites: userPopulated.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const removeFavorite = async (req, res) => {
  console.log('removeFavorite called', req.params.eventId, req.user?._id || req.user?.id);
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(
      id => id.toString() !== req.params.eventId
    );
    await user.save();
    // Retourne les favoris peuplés
    const userPopulated = await User.findById(req.user._id).populate('favorites');
    res.json({ favorites: userPopulated.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
import express from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoriteController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Get all favorites for the authenticated user
router.get('/', auth, getFavorites);

// Add a favorite (expects { eventId } in body)
router.post('/', auth, addFavorite);

// Remove a favorite by eventId in URL
router.delete('/:eventId', auth, removeFavorite);

export default router;
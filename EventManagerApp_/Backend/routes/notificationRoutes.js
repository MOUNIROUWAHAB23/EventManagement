import express from 'express';
import { getUserNotifications, sendNotification, deleteNotification } from '../controllers/notificationController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', auth, getUserNotifications);
router.post('/', auth, sendNotification);
router.delete('/:id', auth, deleteNotification);

export default router;
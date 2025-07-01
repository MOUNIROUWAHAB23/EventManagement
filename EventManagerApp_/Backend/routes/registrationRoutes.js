import express from 'express';
import { getUserRegistrations, registerToEvent, unregisterFromEvent } from '../controllers/registrationController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', auth, getUserRegistrations);
router.post('/', auth, registerToEvent);
router.delete('/:id', auth, unregisterFromEvent);

export default router;
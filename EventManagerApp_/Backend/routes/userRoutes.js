import express from 'express';
import { getAllUsers, getUserById, deleteUser, updateUserProfile } from '../controllers/userController.js';
import auth from '../middlewares/auth.js';
import Users from '../models/userModel.js';
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await Users.findById(req.user._id).select('-password');
  res.json({ user });
});
router.get('/', auth, getAllUsers);
router.get('/:id', auth, getUserById);
router.delete('/:id', auth, deleteUser);
router.put('/me', auth, updateUserProfile);

export default router;
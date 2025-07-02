import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};


export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Modifie les champs si présents dans la requête
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    // Si mot de passe fourni, le hasher
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();

    // Ne retourne pas le mot de passe
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ message: 'Profil mis à jour', user: userObj });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
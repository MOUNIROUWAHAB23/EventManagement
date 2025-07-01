import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader);

    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      console.log('❌ Aucun token trouvé');
      return res.status(401).json({ message: 'Accès refusé. Token requis.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token décodé:', decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    req.user = user;
    console.log('✅ Authentification réussie pour:', user.email);
    next();
  } catch (err) {
    console.error('❌ Erreur middleware auth:', err.message);
    res.status(401).json({ message: 'Token invalide.' });
  }
};

export default auth;

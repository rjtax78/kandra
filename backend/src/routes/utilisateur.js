import express from 'express';
import { register, login, me } from '../controllers/utilisateurController.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

// Inscription
router.post('/register', register);

// Connexion
router.post('/login', login);

// Récupérer mes infos (si connecté)
router.get('/me', auth, me);

export default router;

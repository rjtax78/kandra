import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { updateProfilEntreprise, listEntreprises, getEntreprise } from '../controllers/entrepriseController.js';

const router = express.Router();
router.put('/profil', auth, updateProfilEntreprise);
router.get('/', auth, listEntreprises);
router.get('/:id', auth, getEntreprise);

export default router;

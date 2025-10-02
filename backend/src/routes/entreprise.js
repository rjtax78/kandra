import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { createEntreprise, listEntreprises, getEntreprise } from '../controllers/entrepriseController.js';

const router = express.Router();
router.post('/', auth, createEntreprise);
router.get('/', auth, listEntreprises);
router.get('/:id', auth, getEntreprise);

export default router;

import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { createAlerte, listAlertes } from '../controllers/alerteController.js';

const router = express.Router();
router.post('/', auth, createAlerte);
router.get('/', auth, listAlertes);

export default router;

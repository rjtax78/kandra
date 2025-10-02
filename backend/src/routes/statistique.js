import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { createStatistique, listStatistiques } from '../controllers/statistiqueController.js';

const router = express.Router();
router.post('/', auth, createStatistique);
router.get('/', auth, listStatistiques);

export default router;

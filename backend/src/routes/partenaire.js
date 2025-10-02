import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { createPartenaire, listPartenaires } from '../controllers/partenaireController.js';

const router = express.Router();
router.post('/', auth, createPartenaire);
router.get('/', auth, listPartenaires);

export default router;

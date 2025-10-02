import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { createCandidat, listCandidats, getCandidat } from '../controllers/candidatController.js';

const router = express.Router();
router.post('/', auth, createCandidat);
router.get('/', auth, listCandidats);
router.get('/:id', auth, getCandidat);

export default router;

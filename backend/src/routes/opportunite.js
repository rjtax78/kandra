import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { createOpportunite, listOpportunites, getOpportunite } from '../controllers/opportuniteController.js';
const router = express.Router();

router.post('/', auth, createOpportunite);
router.get('/', auth, listOpportunites);
router.get('/:id', auth, getOpportunite);

export default router;

import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { createRessource, listRessources } from '../controllers/ressourceController.js';

const router = express.Router();
router.post('/', auth, createRessource);
router.get('/', auth, listRessources);

export default router;

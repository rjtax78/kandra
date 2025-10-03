import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { postuler, listCandidaturesPourOffre } from '../controllers/candidatureController.js';
const router = express.Router();

router.post('/', auth, postuler);
router.get('/opportunite/:id', auth, listCandidaturesPourOffre);

export default router;

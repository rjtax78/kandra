import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { 
  createCandidat, 
  listCandidats, 
  getCandidat, 
  updateProfilEtudiant, 
  getMonProfil, 
  getStatistiquesEtudiant,
  listEtudiants,
  getEtudiant
} from '../controllers/candidatController.js';

const router = express.Router();

// Legacy routes
router.post('/', auth, createCandidat);
router.get('/', auth, listCandidats);
router.get('/:id', auth, getCandidat);

// Student profile management routes
router.get('/profile/me', auth, getMonProfil);
router.put('/profile/me', auth, updateProfilEtudiant);
router.get('/profile/stats', auth, getStatistiquesEtudiant);

// Admin routes for student management
router.get('/etudiants/list', auth, listEtudiants);
router.get('/etudiants/:id', auth, getEtudiant);

export default router;

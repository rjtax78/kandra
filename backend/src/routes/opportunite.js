import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { 
  createOpportunite, 
  listOpportunites, 
  getOpportunite,
  updateOpportunite,
  deleteOpportunite,
  getCompanyOffers,
  getCompanyStats
} from '../controllers/opportuniteController.js';
const router = express.Router();

// Public routes
router.get('/', auth, listOpportunites);
router.get('/:id', auth, getOpportunite);

// Company-specific routes
router.post('/', auth, createOpportunite);
router.put('/:id', auth, updateOpportunite);
router.delete('/:id', auth, deleteOpportunite);
router.get('/company/offers', auth, getCompanyOffers);
router.get('/company/stats', auth, getCompanyStats);

export default router;

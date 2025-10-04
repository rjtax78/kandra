import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import {
  getCompanyApplications,
  updateApplicationStatus,
  bulkUpdateApplications,
  getCompanyJobs,
  getCandidateDetails
} from '../controllers/companyApplicationsController.js';

const router = express.Router();

// Middleware to check if user is a company
const requireCompany = (req, res, next) => {
  if (req.user && req.user.role === 'entreprise') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Accès refusé. Droits entreprise requis.'
    });
  }
};

// Get all applications for company's jobs
router.get('/', auth, requireCompany, getCompanyApplications);

// Get company's job list for filtering
router.get('/jobs', auth, requireCompany, getCompanyJobs);

// Update single application status
router.put('/:applicationId/status', auth, requireCompany, updateApplicationStatus);

// Bulk update application statuses
router.put('/bulk-update', auth, requireCompany, bulkUpdateApplications);

// Get detailed candidate information
router.get('/:applicationId/candidate/:candidateId', auth, requireCompany, getCandidateDetails);

export default router;
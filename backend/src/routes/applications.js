import express from 'express';
import multer from 'multer';
import path from 'path';
import auth from '../middlewares/authMiddleware.js';
import { 
  postuler, 
  listMesCandidatures, 
  listCandidaturesPourOffre,
  updateStatutCandidature,
  getCandidatureDetails 
} from '../controllers/candidatureController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow only specific file types
    const allowedTypes = /pdf|doc|docx|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, ZIP, and RAR files are allowed'));
    }
  }
});

// Submit job application (maps to postuler)
router.post('/', auth, upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'portfolio', maxCount: 1 }
]), async (req, res) => {
  try {
    // Transform frontend data to backend format
    const applicationData = {
      offreId: req.body.jobId,
      lettreMotivation: req.body.coverLetter,
      motivation: req.body.motivation,
      portfolioUrl: req.body.portfolioUrl,
      linkedinUrl: req.body.linkedinUrl,
      additionalNotes: req.body.additionalNotes,
      appliedAt: req.body.appliedAt
    };

    // Handle file uploads
    if (req.files) {
      if (req.files.resume && req.files.resume[0]) {
        applicationData.cvJoint = req.files.resume[0].filename;
      }
      if (req.files.portfolio && req.files.portfolio[0]) {
        applicationData.portfolioFile = req.files.portfolio[0].filename;
      }
    }

    // Create a new request object for the postuler function
    const newReq = {
      ...req,
      body: applicationData
    };

    // Call the existing postuler function
    await postuler(newReq, res);
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get user's applications
router.get('/user', auth, async (req, res) => {
  try {
    await listMesCandidatures(req, res);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get application details by ID
router.get('/:id', auth, async (req, res) => {
  try {
    await getCandidatureDetails(req, res);
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({ error: 'Failed to fetch application details' });
  }
});

// Update application status
router.put('/:id/status', auth, async (req, res) => {
  try {
    await updateStatutCandidature(req, res);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

export default router;
import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { 
  getDashboardStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getJobManagementData,
  getCompanyManagementData,
  getSystemAlerts
} from '../controllers/adminController.js';

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Accès refusé. Droits administrateur requis.'
    });
  }
};

// Dashboard statistics
router.get('/dashboard/stats', auth, requireAdmin, getDashboardStats);

// User management
router.get('/users', auth, requireAdmin, getUsers);
router.put('/users/:userId/status', auth, requireAdmin, updateUserStatus);
router.delete('/users/:userId', auth, requireAdmin, deleteUser);

// Job management
router.get('/jobs/management', auth, requireAdmin, getJobManagementData);

// Company management
router.get('/companies/management', auth, requireAdmin, getCompanyManagementData);

// System alerts
router.get('/alerts', auth, requireAdmin, getSystemAlerts);

export default router;
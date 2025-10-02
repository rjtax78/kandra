import express from 'express';
import multer from 'multer';
import auth from '../middlewares/authMiddleware.js';
import { uploadCV, listCVs } from '../controllers/cvController.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/upload', auth, upload.single('cv'), uploadCV);
router.get('/', auth, listCVs);

export default router;

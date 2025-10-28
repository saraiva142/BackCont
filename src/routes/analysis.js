import express from 'express';
import multer from 'multer';
import { uploadAndAnalyze, getAnalyses } from '../controllers/analysis.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticateUser);

router.post('/upload', upload.single('file'), uploadAndAnalyze);
router.get('/history', getAnalyses);

export default router;
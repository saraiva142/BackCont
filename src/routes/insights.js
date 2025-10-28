import express from 'express';
import { askQuestion } from '../controllers/insights.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);
router.post('/ask', askQuestion);

export default router;
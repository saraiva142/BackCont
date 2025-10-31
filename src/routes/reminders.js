import express from 'express';
import { getReminders } from '../services/taxReminders.js';

const router = express.Router();

router.get('/tax-deadlines', async (req, res) => {
  try {
    const deadlines = await getReminders();
    res.json(deadlines);
  } catch (error) {
    console.error('Error getting tax deadlines:', error);
    res.status(500).json({ error: 'Erro ao buscar prazos fiscais' });
  }
});

export default router;
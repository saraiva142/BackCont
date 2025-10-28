import express from 'express';
import { createClient } from '@supabase/supabase-js';
import config from '../config.js';

const router = express.Router();

const supabase = createClient(config.supabase.url, config.supabase.anonKey);
console.log('✅ Supabase auth inicializado');

router.get('/session', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.json({ user: null });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      return res.json({ user: null });
    }

    res.json({ user });
  } catch (error) {
    console.error('Session error:', error);
    res.json({ user: null });
  }
});

export default router;
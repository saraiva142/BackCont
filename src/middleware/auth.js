import { createClient } from '@supabase/supabase-js';
import config from '../config.js';

const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);
console.log('✅ Supabase middleware inicializado');

export const authenticateUser = async (req, res, next) => {
  // ⚠️ MODO DESENVOLVIMENTO - desative em produção
  const DEV_MODE = true;
  
  if (DEV_MODE) {
    console.log('⚠️  Modo desenvolvimento - autenticação bypass');
    req.user = { 
      id: '12345678-1234-1234-1234-123456789abc', // UUID válido
      email: 'dev@example.com',
      user_metadata: { full_name: 'Usuário Dev' }
    };
    return next();
  }
  
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Carregar .env de forma explícita
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

console.log('📁 Tentando carregar .env de:', envPath);
dotenv.config({ path: envPath });

// Configurações
const config = {
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY
  },
  server: {
    port: process.env.PORT || 3001,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  }
};

// Debug das variáveis
console.log('🔍 Variáveis carregadas:');
console.log('SUPABASE_URL:', config.supabase.url ? '✅' : '❌', config.supabase.url);
console.log('SUPABASE_ANON_KEY:', config.supabase.anonKey ? '✅' : '❌', config.supabase.anonKey?.substring(0, 20) + '...');
console.log('GROQ_API_KEY:', config.groq.apiKey ? '✅' : '❌', config.groq.apiKey?.substring(0, 20) + '...');

// Se faltam variáveis críticas, usar fallbacks
if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  console.warn('⚠️  Variáveis do Supabase não encontradas. Usando modo desenvolvimento.');
  
  // Fallback para desenvolvimento
  config.supabase.url = config.supabase.url || 'https://example.supabase.co';
  config.supabase.serviceRoleKey = config.supabase.serviceRoleKey || 'example-key';
}

export default config;
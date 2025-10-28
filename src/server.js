import express from 'express';
import cors from 'cors';
import config from './config.js'; // ⚠️ Agora carrega primeiro

console.log('🚀 Iniciando servidor...');

// Agora importe as rotas DEPOIS do config
import authRoutes from './routes/auth.js';
import analysisRoutes from './routes/analysis.js';
import insightsRoutes from './routes/insights.js';

const app = express();
const PORT = config.server.port;

app.use(cors({
  origin: config.server.frontendUrl,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/insights', insightsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Financial AI API is running',
    timestamp: new Date().toISOString(),
    config: {
      supabase: !!config.supabase.url,
      groq: !!config.groq.apiKey
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});
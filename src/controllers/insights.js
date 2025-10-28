import { answerFinancialQuestion } from '../services/groq.js';
import { getUserTransactions } from '../services/supabase.js';

export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Pergunta é obrigatória' });
    }

    // Get user's transaction history
    const userHistory = await getUserTransactions(req.user.id);

    if (userHistory.length === 0) {
      return res.status(400).json({ 
        error: 'Nenhum dado financeiro encontrado. Faça upload de dados primeiro.' 
      });
    }

    // Get AI response
    const answer = await answerFinancialQuestion(question, userHistory);

    res.json({
      success: true,
      question,
      answer,
      historyCount: userHistory.length
    });

  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ 
      error: error.message || 'Erro ao processar pergunta' 
    });
  }
};
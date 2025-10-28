import { analyzeFinancialData } from '../services/groq.js';
import { saveAnalysis, getUserAnalyses } from '../services/supabase.js';
import { parseCSV, parseXLSX, parsePDF } from '../utils/fileParser.js';

export const uploadAndAnalyze = async (req, res) => {
  try {
    const { text } = req.body;
    const file = req.file;
    let textData = text;

    if (file) {
      // Process uploaded file
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      
      switch (fileExtension) {
        case 'csv':
          textData = await parseCSV(file.buffer);
          break;
        case 'xlsx':
        case 'xls':
          textData = await parseXLSX(file.buffer);
          break;
        case 'pdf':
          // PDF desabilitado temporariamente
          return res.status(400).json({ 
            error: 'Processamento de PDF temporariamente desabilitado. Use arquivos CSV ou Excel.' 
          });
        default:
          throw new Error('Formato de arquivo não suportado. Use CSV, XLS ou XLSX.');
      }
    }

    if (!textData) {
      return res.status(400).json({ error: 'Nenhum dado fornecido para análise' });
    }

    // Analyze with Groq
    const analysis = await analyzeFinancialData(textData, file?.originalname);

    // Save to database
    const savedAnalysis = await saveAnalysis({
      user_id: req.user.id,
      title: analysis.title,
      category: analysis.category,
      amount: analysis.amount,
      taxes: analysis.taxes,
      insights: analysis.insights,
      monthly_summary: analysis.monthlySummary,
      original_data: textData.substring(0, 1000), // Store first 1000 chars
      operation_type: analysis.operationType
    });

    res.json({
      success: true,
      analysis: savedAnalysis
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: error.message || 'Erro ao processar análise financeira' 
    });
  }
};

export const getAnalyses = async (req, res) => {
  try {
    const analyses = await getUserAnalyses(req.user.id);
    res.json(analyses);
  } catch (error) {
    console.error('Get analyses error:', error);
    res.status(500).json({ error: 'Erro ao buscar análises' });
  }
};
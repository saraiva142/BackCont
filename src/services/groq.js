import Groq from 'groq-sdk';

const groqApiKey = process.env.GROQ_API_KEY;

let groq;

if (!groqApiKey) {
  console.error('❌ GROQ_API_KEY não configurada!');
} else {
  groq = new Groq({
    apiKey: groqApiKey
  });
  console.log('✅ Groq cliente inicializado');
}

export const analyzeFinancialData = async (textData, fileName = '') => {
  try {
    // Se Groq não está configurado, retornar análise mock
    if (!groq) {
      console.warn('⚠️  Groq não configurado - retornando análise mock');
      return {
        operationType: "Venda de Serviços",
        category: "Serviços",
        amount: 5000,
        taxes: {
          simplesNacional: 300,
          irpj: 750,
          csll: 450,
          total: 1500
        },
        insights: [
          "Modo desenvolvimento ativo - configure GROQ_API_KEY para análises reais",
          "Considerar regime Simples Nacional para otimização fiscal",
          "Manter controle mensal de receitas e despesas"
        ],
        monthlySummary: "Análise realizada em modo de desenvolvimento. Configure as variáveis de ambiente para usar a IA real.",
        title: "Análise Mock - " + (fileName || "Dados de Exemplo")
      };
    }

    const prompt = `
Analise os seguintes dados financeiros e forneça insights contábeis:

DADOS:
${textData}

INSTRUÇÕES:
1. Identifique o tipo de operação financeira
2. Categorize gastos/receitas (ex: equipamentos, serviços, matéria-prima, vendas)
3. Calcule impostos considerando:
   - Simples Nacional como regime inicial (6% sobre faturamento para serviços)
   - IRPJ/CSLL quando aplicável (15% de IRPJ + 9% de CSLL para lucro presumido)
4. Forneça insights financeiros relevantes
5. Sugira otimizações fiscais quando possível

FORMATO DE RESPOSTA (JSON):
{
  "operationType": "tipo da operação",
  "category": "categoria contábil",
  "amount": valor numérico,
  "taxes": {
    "simplesNacional": valor,
    "irpj": valor,
    "csll": valor,
    "total": valor
  },
  "insights": ["insight 1", "insight 2", "insight 3"],
  "monthlySummary": "resumo do mês",
  "title": "título descritivo baseado nos dados"
}

Apenas retorne o JSON, sem formatação adicional.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um especialista contábil brasileiro. Analise dados financeiros e forneça insights precisos."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 1024
    });

    const response = completion.choices[0]?.message?.content;
    
    // Limpar a resposta e extrair apenas o JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Resposta da IA em formato inválido');
    }
  } catch (error) {
    console.error('Error analyzing with Groq:', error);
    // Fallback para análise mock em caso de erro
    return {
      operationType: "Operação Financeira",
      category: "Outros",
      amount: 1000,
      taxes: {
        simplesNacional: 60,
        irpj: 150,
        csll: 90,
        total: 300
      },
      insights: [
        "Análise realizada em modo fallback",
        "Configure GROQ_API_KEY para análises com IA real",
        "Revise os cálculos com seu contador"
      ],
      monthlySummary: "Análise básica - configure a API da Groq para insights detalhados",
      title: "Análise Fallback - " + (fileName || "Dados Fornecidos")
    };
  }
};

export const answerFinancialQuestion = async (question, userHistory) => {
  try {
    // Se Groq não está configurado, retornar resposta mock
    if (!groq) {
      return "🤖 **Modo Desenvolvimento**\n\nPara usar as Observações Inteligentes, configure a GROQ_API_KEY no arquivo .env do backend.\n\nEnquanto isso, aqui está um exemplo do que a IA pode fazer:\n- Analisar seus gastos e receitas\n- Identificar oportunidades de economia\n- Sugerir otimizações fiscais\n- Fornecer insights sobre tendências financeiras";
    }

    const prompt = `
Baseado no histórico financeiro do usuário abaixo, responda à pergunta:

HISTÓRICO DO USUÁRIO:
${JSON.stringify(userHistory.slice(0, 10), null, 2)}

PERGUNTA DO USUÁRIO:
${question}

INSTRUÇÕES:
- Seja preciso e baseie-se apenas nos dados fornecidos
- Forneça insights práticos e acionáveis
- Se não houver dados suficientes, peça mais informações
- Mantenha uma linguagem profissional mas acessível

Responda em português de forma clara e direta.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um consultor financeiro especializado em análise de dados contábeis brasileiros."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.4,
      max_tokens: 1024
    });

    return completion.choices[0]?.message?.content;
  } catch (error) {
    console.error('Error answering question:', error);
    return "Desculpe, ocorreu um erro ao processar sua pergunta. Verifique se a GROQ_API_KEY está configurada corretamente.";
  }
};
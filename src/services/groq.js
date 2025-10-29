import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const analyzeFinancialData = async (textData, fileName = '') => {
  try {
    const prompt = `
CONSULTORIA FISCAL E CONTÁBIL COMPLETA - ESPECIALISTA PRÁTICO

## DADOS DA OPERAÇÃO:
${textData}

## SUA MISSÃO:
Atue como um CONTADOR SÊNIOR com 20 anos de experiência. Forneça não apenas cálculos, mas ORIENTAÇÕES PRÁTICAS passo a passo.

## FORMATO DE RESPOSTA OBRIGATÓRIO (JSON VÁLIDO):
{
  "operationType": "tipo_detalhado_da_operacao",
  "category": "categoria_contabil",
  "amount": 50000,
  "taxes": {
    "simplesNacional": {
      "valor": 3000,
      "aliquota": "6%", 
      "observacao": "Serviços - Anexo III"
    },
    "lucroPresumido": {
      "irpj": 7500,
      "csll": 4500,
      "pisCofins": 3600,
      "total": 15600
    },
    "melhorRegime": "Simples Nacional",
    "economiaPotencial": "R$ 12.600 em comparação com Lucro Presumido"
  },
  "financialAnalysis": {
    "margemLucro": "45%",
    "saudeFinanceira": "boa",
    "riscosIdentificados": ["Concentração em um cliente", "Sazonalidade"],
    "oportunidades": ["Expansão para novos mercados", "Otimização de custos"]
  },
  "documentationGuide": {
    "reciboObrigatorio": true,
    "tipoRecibo": "Recibo de Pagamento Antecipado",
    "notaFiscal": "NFSe de serviço - modelo 55",
    "declaracoes": ["DASN", "DIRF", "DCTF"],
    "prazosImportantes": ["DAS: até dia 20 do mês seguinte", "DIRF: até final de fevereiro"],
    "documentosNecessarios": ["Contrato de prestação de serviço", "Comprovante de pagamento", "RPA assinado"]
  },
  "practicalSteps": [
    "1. Emitir Recibo de Pagamento Antecipado imediatamente",
    "2. Registrar como 'Receita Antecipada' no contas a receber", 
    "3. Provisionar 6% para DAS do Simples Nacional",
    "4. Emitir NFSe na data do serviço/prestação",
    "5. Manter contrato assinado em arquivo digital"
  ],
  "legalObligations": [
    "⚠️ Obrigatório: Emitir recibo para valores acima de R$ 5.000",
    "📅 Prazo: Declarar receita antecipada no mês do recebimento",
    "📋 Documentação: Contrato deve conter cláusula de adiantamento",
    "💸 Multa: Até 150% do imposto em caso de não declaração"
  ],
  "bestPractices": [
    "✅ Sempre emitir recibo mesmo para clientes informais",
    "✅ Separar valor reembolsável da receita principal",
    "✅ Manter cópia digital dos documentos por 5 anos",
    "✅ Consultar contador para operações atípicas"
  ],
  "strategicInsights": [
    "💰 Economia fiscal de 12% com Simples Nacional vs Lucro Presumido",
    "📊 Considerar adiantamento como empréstimo se serviço for cancelado",
    "🛡️ Criar reserva técnica de 10% para impostos surpresa"
  ],
  "alerts": [
    "🚨 VALOR SUPERIOR A R$ 5.000: Obrigatório recibo e documentação",
    "📅 PRÓXIMO PRAZO: DAS até dia 20 do mês seguinte",
    "⚠️ ATENÇÃO: Receita antecipada tem tratamento contábil específico"
  ],
  "monthlySummary": "Operação de recebimento antecipado requer cuidados especiais com documentação. Economia significativa com Simples Nacional.",
  "title": "Consultoria Completa - Recebimento Antecipado"
}

## ORIENTAÇÕES ESPECÍFICAS POR TIPO DE OPERAÇÃO:

### 📝 PARA SERVIÇOS PRESTADOS:
- Quando emitir recibo: SEMPRE que houver transferência
- Tipo de nota fiscal: NFSe (Nota Fiscal de Serviço)
- Declarações: DASN mensal, DIRF anual
- Cuidados: Separar ISS municipal de outros impostos

### 💰 PARA VENDAS DE PRODUTOS:
- Documento: NFC-e ou NFe
- Regime: ICMS estadual + impostos federais
- Obrigações: EFD Contribuições, SPED Fiscal

### 🌍 PARA OPERAÇÕES INTERNACIONAIS:
- Documentação: Contrato em inglês, invoice
- Impostos: IOF, IRRF, cambial
- Declarações: SISCOMEX, EFD-ICMS/IPI

### 🏦 PARA ADIANTAMENTOS:
- Tratamento: Receita antecipada (retificável)
- Provisão: Impostos sobre valor total
- Cuidado: Reembolsos são despesas, não redução de receita

Baseado nos dados fornecidos, retorne APENAS o JSON válido com orientações PRÁTICAS e ACIONÁVEIS.
`;

    console.log('🤖 Enviando para consultoria fiscal da Groq...');
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é um contador sênior especializado em orientações práticas fiscais e contábeis. 
          Forneça instruções PASSO A PASSO sobre documentação, recibos, declarações e obrigações legais.
          Seja PRÁTICO e ESPECÍFICO como se estivesse orientando um cliente.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.4,
      max_tokens: 3072,
      top_p: 0.9
    });

    const response = completion.choices[0]?.message?.content;
    console.log('📨 Resposta da consultoria:', response);

    // Parser robusto
    let parsedResponse;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSON não encontrado na resposta');
      }
    } catch (parseError) {
      console.error('❌ Erro ao parsear JSON:', parseError.message);
      throw new Error('Resposta da IA em formato inválido: ' + parseError.message);
    }

    console.log('✅ Consultoria fiscal parseada com sucesso');
    return parsedResponse;

  } catch (error) {
    console.error('❌ Error analyzing with Groq:', error.message);
    return getEnhancedFallbackAnalysis(textData, fileName);
  }
};

// Fallback com orientações básicas
const getEnhancedFallbackAnalysis = (textData, fileName) => {
  const amount = extractAmountFromText(textData);
  
  return {
    operationType: "Análise Fiscal Detalhada",
    category: "Consultoria Contábil",
    amount: amount,
    taxes: {
      simplesNacional: {
        valor: amount * 0.06,
        aliquota: "6%",
        observacao: "Serviços - Anexo III"
      },
      lucroPresumido: {
        irpj: amount * 0.15,
        csll: amount * 0.09,
        pisCofins: amount * 0.085,
        total: amount * 0.325
      },
      melhorRegime: "Simples Nacional",
      economiaPotencial: `R$ ${(amount * 0.265).toFixed(2)} em economia fiscal`
    },
    documentationGuide: {
      reciboObrigatorio: amount > 5000,
      tipoRecibo: "Recibo de Pagamento para Serviços",
      notaFiscal: "NFSe - Nota Fiscal de Serviço",
      declaracoes: ["DASN", "DIRF"],
      prazosImportantes: ["DAS: até dia 20 todo mês"],
      documentosNecessarios: ["Contrato", "Comprovante", "Recibo"]
    },
    practicalSteps: [
      "1. Configure GROQ_API_KEY para orientações específicas",
      "2. Consulte um contador para documentação exata",
      "3. Mantenha todos os recibos e comprovantes"
    ],
    legalObligations: [
      "⚠️ Configure a API para detalhes de obrigações legais",
      "📅 Prazos fiscais variam por tipo de empresa"
    ],
    bestPractices: [
      "✅ Sempre emitir recibos para qualquer valor",
      "✅ Manter documentação organizada por 5 anos",
      "✅ Consultar especialista para dúvidas específicas"
    ],
    strategicInsights: [
      "🚀 Configure GROQ_API_KEY para insights personalizados",
      "💰 Economia fiscal disponível com regime correto",
      "📊 Análise completa com orientações práticas"
    ],
    alerts: [
      "⚠️ Configure GROQ_API_KEY para alertas específicos",
      "📅 Orientações detalhadas disponíveis após configuração"
    ],
    monthlySummary: "Consultoria fiscal completa disponível após configuração da API Groq.",
    title: "Orientação Fiscal - " + (fileName || "Dados Fornecidos")
  };
};

// Função para extrair valores do texto
const extractAmountFromText = (text) => {
  // Procura por padrões com R$
  const brlMatch = text.match(/R\$\s*(\d+[.,]\d+|\d+)/);
  if (brlMatch) {
    return parseFloat(brlMatch[1].replace(',', '.').replace('.', ''));
  }
  
  // Procura por números grandes (provavelmente valores)
  const numberMatch = text.match(/(\d+[.,]\d+|\d+)\s*(mil|milhões|mi|mi|k)/i);
  if (numberMatch) {
    let value = parseFloat(numberMatch[1].replace(',', '.').replace('.', ''));
    if (numberMatch[2] && numberMatch[2].toLowerCase().includes('mil')) {
      value *= 1000;
    }
    return value;
  }
  
  // Procura por qualquer número grande
  const largeNumberMatch = text.match(/\b(\d{4,})\b/);
  if (largeNumberMatch) {
    return parseFloat(largeNumberMatch[1]);
  }
  
  return 1000; // Valor padrão
};

export const answerFinancialQuestion = async (question, userHistory) => {
  try {
    const prompt = `
## PERGUNTA DO USUÁRIO:
${question}

## HISTÓRICO DO USUÁRIO (últimas 10 análises):
${JSON.stringify(userHistory.slice(0, 10), null, 2)}

## SUA RESPOSTA:
Forneça uma análise estratégica baseada no histórico. Seja específico, use números concretos e dê recomendações acionáveis.

Formate a resposta em parágrafos claros com emojis para melhor legibilidade.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um consultor financeiro especializado em análise de dados contábeis. Seja prático e baseie-se apenas nos dados fornecidos."
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
    return "🚀 **CONSULTORIA AVANÇADA**\n\nPara receber análises estratégicas detalhadas, configure a GROQ_API_KEY corretamente.\n\n**Próximos passos:**\n1. Verifique se a chave da Groq está correta no arquivo .env\n2. Reinicie o servidor backend\n3. Teste novamente a análise";
  }
};
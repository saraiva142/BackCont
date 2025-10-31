// Serviço para gerenciar lembretes fiscais
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REMINDERS_FILE = path.join(__dirname, '../data/reminders.json');

// Lembretes fiscais padrão
const DEFAULT_REMINDERS = [
  {
    id: 1,
    title: "Declaração do Imposto de Renda",
    description: "Prazo para entrega da Declaração Anual do Imposto de Renda",
    dueDate: "2024-04-30",
    type: "federal",
    priority: "high",
    recurring: true
  },
  {
    id: 2,
    title: "Pagamento do Simples Nacional",
    description: "Vencimento mensal do Simples Nacional",
    dueDate: "2024-04-20",
    type: "federal",
    priority: "high",
    recurring: true
  },
  {
    id: 3,
    title: "Declaração DASN-SIMEI",
    description: "Declaração anual para MEI",
    dueDate: "2024-08-31",
    type: "federal",
    priority: "medium",
    recurring: true
  },
  {
    id: 4,
    title: "Pagamento de ICMS",
    description: "Imposto sobre Circulação de Mercadorias e Serviços",
    dueDate: "2024-04-25",
    type: "state",
    priority: "high",
    recurring: true
  },
  {
    id: 5,
    title: "Pagamento de ISS",
    description: "Imposto Sobre Serviços",
    dueDate: "2024-04-10",
    type: "municipal",
    priority: "high",
    recurring: true
  },
  {
    id: 6,
    title: "Entrega da ECD",
    description: "Escrituração Contábil Digital",
    dueDate: "2024-07-31",
    type: "federal",
    priority: "medium",
    recurring: true
  },
  {
    id: 7,
    title: "Entrega da ECF",
    description: "Escrituração Contábil Fiscal",
    dueDate: "2024-07-31",
    type: "federal",
    priority: "medium",
    recurring: true
  },
  {
    id: 8,
    title: "Pagamento do INSS",
    description: "Contribuição previdenciária",
    dueDate: "2024-04-15",
    type: "federal",
    priority: "high",
    recurring: true
  },
  {
    id: 9,
    title: "Declaração de Débitos e Créditos Tributários Federais (DCTF)",
    description: "Declaração mensal de débitos e créditos fiscais",
    dueDate: "2024-04-25",
    type: "federal",
    priority: "high",
    recurring: true
  },
  {
    id: 10,
    title: "Revisão Fiscal Anual",
    description: "Revisão completa da situação fiscal do ano",
    dueDate: "2024-12-31",
    type: "general",
    priority: "medium",
    recurring: true
  }
];

// Função para ler lembretes do arquivo
async function readReminders() {
  try {
    const data = await readFile(REMINDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, cria com os lembretes padrão
    if (error.code === 'ENOENT') {
      await writeFile(REMINDERS_FILE, JSON.stringify(DEFAULT_REMINDERS, null, 2));
      return DEFAULT_REMINDERS;
    }
    throw error;
  }
}

// Função para salvar lembretes no arquivo
async function writeReminders(reminders) {
  await writeFile(REMINDERS_FILE, JSON.stringify(reminders, null, 2));
}

// Serviço para obter todos os lembretes
export async function getReminders() {
  try {
    const reminders = await readReminders();
    
    // Filtra apenas lembretes futuros ou do mês atual
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return reminders.filter(reminder => {
      const dueDate = new Date(reminder.dueDate);
      return dueDate >= new Date(now.getFullYear(), now.getMonth(), 1) || 
             reminder.recurring;
    });
  } catch (error) {
    console.error('Erro ao ler lembretes:', error);
    return DEFAULT_REMINDERS;
  }
}

// Serviço para obter lembretes por prioridade
export async function getRemindersByPriority(priority) {
  const reminders = await getReminders();
  return reminders.filter(reminder => reminder.priority === priority);
}

// Serviço para obter lembretes por tipo
export async function getRemindersByType(type) {
  const reminders = await getReminders();
  return reminders.filter(reminder => reminder.type === type);
}

// Serviço para marcar lembrete como concluído
export async function markReminderCompleted(id) {
  const reminders = await readReminders();
  const updatedReminders = reminders.map(reminder => 
    reminder.id === id ? { ...reminder, completed: true, completedAt: new Date().toISOString() } : reminder
  );
  await writeReminders(updatedReminders);
  return updatedReminders.find(reminder => reminder.id === id);
}

// Serviço para criar novo lembrete
export async function createReminder(reminderData) {
  const reminders = await readReminders();
  const newReminder = {
    id: Math.max(...reminders.map(r => r.id)) + 1,
    ...reminderData,
    createdAt: new Date().toISOString(),
    completed: false
  };
  
  reminders.push(newReminder);
  await writeReminders(reminders);
  return newReminder;
}

// Serviço para atualizar lembrete
export async function updateReminder(id, updateData) {
  const reminders = await readReminders();
  const reminderIndex = reminders.findIndex(reminder => reminder.id === id);
  
  if (reminderIndex === -1) {
    throw new Error('Lembrete não encontrado');
  }
  
  reminders[reminderIndex] = {
    ...reminders[reminderIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  await writeReminders(reminders);
  return reminders[reminderIndex];
}

// Serviço para deletar lembrete
export async function deleteReminder(id) {
  const reminders = await readReminders();
  const filteredReminders = reminders.filter(reminder => reminder.id !== id);
  
  if (filteredReminders.length === reminders.length) {
    throw new Error('Lembrete não encontrado');
  }
  
  await writeReminders(filteredReminders);
  return { message: 'Lembrete deletado com sucesso' };
}

export default {
  getReminders,
  getRemindersByPriority,
  getRemindersByType,
  markReminderCompleted,
  createReminder,
  updateReminder,
  deleteReminder
};
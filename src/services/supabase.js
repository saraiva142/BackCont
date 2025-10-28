import { createClient } from '@supabase/supabase-js';
import config from '../config.js';

export const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);
console.log('✅ Supabase serviços inicializado');

export const getUserAnalyses = async (userId) => {
  const { data, error } = await supabase
    .from('financial_analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const saveAnalysis = async (analysisData) => {
  const { data, error } = await supabase
    .from('financial_analyses')
    .insert([analysisData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserTransactions = async (userId) => {
  const { data, error } = await supabase
    .from('financial_analyses')
    .select('title, category, amount, taxes, insights, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
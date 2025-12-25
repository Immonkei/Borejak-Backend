import { supabase } from '../../config/supabase.js';

// 🔒 Admin — create tip
export async function createTip(payload) {
  const { data, error } = await supabase
    .from('tips')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 🔒 Admin — update tip
export async function updateTip(id, payload) {
  const { data, error } = await supabase
    .from('tips')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 🔒 Admin — delete tip
export async function deleteTip(id) {
  const { data, error } = await supabase
    .from('tips')
    .update({ is_published: false })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 🌍 Public — published tips
export async function listPublishedTips() {
  const { data, error } = await supabase
    .from('tips')
    .select('*')
    .eq('is_published', true)
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

// 🔒 Admin — all tips
export async function listAllTips() {
  const { data, error } = await supabase
    .from('tips')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

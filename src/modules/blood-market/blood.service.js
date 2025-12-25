import { supabase } from '../../config/supabase.js';

function normalizeBloodType(value) {
  if (!value) return value;
  return value.replace(/\s+/g, '').toUpperCase();
}


// Create
export async function createBloodMarket(payload) {
  const { data, error } = await supabase
    .from('blood_market')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// List with filters
export async function listBloodMarket(filters = {}) {
  let query = supabase
    .from('blood_market')
    .select('*, users(full_name)')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (filters.type) query = query.eq('type', filters.type);
  if (filters.blood_type) query = query.eq('blood_type', normalizeBloodType(filters.blood_type));
  if (filters.urgency) query = query.eq('urgency', filters.urgency);
  if (filters.location) query = query.ilike('location', `%${filters.location}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Get one
export async function getBloodMarketById(id, isAdmin = false) {
  let query = supabase
    .from('blood_market')
    .select('*')
    .eq('id', id);

  if (!isAdmin) {
    query = query.eq('status', 'open');
  }

  const { data, error } = await query.single();
  if (error || !data) {
    throw { status: 404, message: 'Not found' };
  }

  return data;
}


// Close own post
export async function closeBloodMarket(id, userId) {
  // ownership check
  const { data: existing, error: findErr } = await supabase
    .from('blood_market')
    .select('id, user_id, status')
    .eq('id', id)
    .single();

  if (findErr) throw findErr;
  if (existing.user_id !== userId) {
      throw { status: 403, message: 'Forbidden' };
  }

  const { data, error } = await supabase
    .from('blood_market')
    .update({ status: 'fulfilled' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Admin delete
export async function deleteBloodMarket(id) {
  const { error } = await supabase
    .from('blood_market')
    .delete()
    .eq('id', id);

  if (error) throw error;
}



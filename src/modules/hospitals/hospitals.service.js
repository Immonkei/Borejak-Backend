import { supabase } from '../../config/supabase.js';

// Create hospital
export async function createHospital(payload) {
  const { data, error } = await supabase
    .from('hospitals')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update hospital
export async function updateHospital(id, payload) {
  const { data, error } = await supabase
    .from('hospitals')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Soft delete hospital
export async function deleteHospital(id) {
  const { data, error } = await supabase
    .from('hospitals')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
// Get all hospitals (admin or public)
export async function getHospitals(isAdmin = false) {
  let query = supabase.from('hospitals').select('*');

  if (!isAdmin) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getHospitalById(id, isAdmin = false) {
  let query = supabase
    .from('hospitals')
    .select('*')
    .eq('id', id);

  if (!isAdmin) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    throw { status: 404, message: 'Hospital not found' };
  }

  return data;
}

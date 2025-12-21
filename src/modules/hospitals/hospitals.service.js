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

// Delete hospital
export async function deleteHospital(id) {
  const { error } = await supabase
    .from('hospitals')
    .delete()
    .eq('id', id);

  if (error) throw error;
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

// Get single hospital
export async function getHospitalById(id) {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

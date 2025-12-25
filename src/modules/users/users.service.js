import { supabase } from '../../config/supabase.js';

// List all users
export async function listUsers() {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id,
      email,
      phone_number,
      full_name,
      role,
      auth_provider,
      is_verified,
      created_at
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Update user role
export async function updateUserRole(userId, role) {
  const { data, error } = await supabase
    .from('users')
    .update({
      role,
      updated_at: new Date()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// "Delete" user (SAFE for your schema)
export async function deactivateUser(userId) {
  const { data, error } = await supabase
    .from('users')
    .update({
      role: 'user',
      is_verified: false,
      updated_at: new Date()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

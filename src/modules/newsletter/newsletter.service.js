import { supabase } from '../../config/supabase.js';

// Subscribe (idempotent)
export async function subscribeEmail(email) {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      { email, is_active: true },
      { onConflict: 'email' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Unsubscribe
export async function unsubscribeEmail(email) {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .update({ is_active: false })
    .eq('email', email)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { email, is_active: false };
    }
    throw error;
  }

  return data;
}


// Admin list
export async function listSubscribers() {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('is_active', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}


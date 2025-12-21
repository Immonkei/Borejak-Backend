import { supabase } from '../../config/supabase.js';

export async function findMatches({ type, blood_type, excludeId }) {
  const oppositeType = type === 'request' ? 'offer' : 'request';

  const { data, error } = await supabase
    .from('blood_market')
    .select('id, type, blood_type, quantity_ml, urgency, location, created_at')
    .eq('type', oppositeType)
    .eq('blood_type', blood_type)
    .eq('status', 'open')
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

import { supabase } from '../../config/supabase.js';

export async function createEvent(payload) {
  const { data, error } = await supabase
    .from('events')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(id, payload) {
  const { data, error } = await supabase
    .from('events')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(id) {
  const { data, error } = await supabase
    .from('events')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listEvents(isAdmin = false, userId = null) {
  let query = supabase
    .from('events')
    .select(`
      *,
      hospitals(name),
      donations(user_id, status)
    `)
    .order('event_date', { ascending: true });

  if (!isAdmin) {
    query = query.in('status', ['upcoming', 'ongoing']);
  }

  const { data, error } = await query;
  if (error) throw error;

  // 🔧 ADD is_registered AND user_registration_status
  return data.map(event => ({
    ...event,
    hospital_name: event.hospitals?.name ?? null,
    is_registered: userId
      ? event.donations?.some(d => d.user_id === userId)
      : false,
    user_registration_status: userId
      ? event.donations?.find(d => d.user_id === userId)?.status ?? null
      : null,
    donations: undefined,
    hospitals: undefined,
  }));
}

export async function getEvent(id, isAdmin = false, userId = null) {
  let query = supabase
    .from('events')
    .select(`
      *,
      hospitals(name),
      donations(user_id, status)
    `)
    .eq('id', id);

  if (!isAdmin) {
    query = query.in('status', ['upcoming', 'ongoing']);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    throw { status: 404, message: 'Event not found' };
  }

  // 🔧 ADD user registration status
  return {
    ...data,
    hospital_name: data.hospitals?.name ?? null,
    is_registered: userId
      ? data.donations?.some(d => d.user_id === userId)
      : false,
    user_registration_status: userId
      ? data.donations?.find(d => d.user_id === userId)?.status ?? null
      : null,
    donations: undefined,
    hospitals: undefined,
  };
}
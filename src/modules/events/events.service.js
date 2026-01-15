import { supabase } from '../../config/supabase.js';

/* =====================================================
   CREATE EVENT (ADMIN)
===================================================== */
export async function createEvent(payload) {
  const { data, error } = await supabase
    .from('events')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* =====================================================
   UPDATE EVENT (ADMIN)
===================================================== */
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

/* =====================================================
   DELETE EVENT (ADMIN – soft delete)
===================================================== */
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

/* =====================================================
   LIST EVENTS (PUBLIC / USER / ADMIN)
   ✅ FIXED: dynamic registered_count
===================================================== */
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

  return data.map(event => {
    // ✅ PARTICIPANTS = approved + completed ONLY
    const participants =
      event.donations?.filter(d =>
        ['approved', 'completed'].includes(d.status)
      ) ?? [];

    const userDonation = userId
      ? event.donations?.find(d => d.user_id === userId)
      : null;

    return {
      ...event,

      hospital_name: event.hospitals?.name ?? null,

      // ✅ THIS IS WHAT FRONTEND NEEDS
      registered_count: participants.length,

      is_registered: Boolean(userDonation),
      user_registration_status: userDonation?.status ?? null,

      // cleanup
      donations: undefined,
      hospitals: undefined,
    };
  });
}

/* =====================================================
   GET SINGLE EVENT (DETAIL PAGE)
   ✅ FIXED: dynamic registered_count
===================================================== */
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

  // ✅ PARTICIPANTS = approved + completed ONLY
  const participants =
    data.donations?.filter(d =>
      ['approved', 'completed'].includes(d.status)
    ) ?? [];

  const userDonation = userId
    ? data.donations?.find(d => d.user_id === userId)
    : null;

  return {
    ...data,

    hospital_name: data.hospitals?.name ?? null,

    // ✅ THIS FIXES THE COUNT
    registered_count: participants.length,

    is_registered: Boolean(userDonation),
    user_registration_status: userDonation?.status ?? null,

    // cleanup
    donations: undefined,
    hospitals: undefined,
  };
}

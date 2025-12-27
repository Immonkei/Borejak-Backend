import { supabase } from '../../config/supabase.js';

// ===============================
// USER: CREATE DONATION
// ===============================
export async function createDonation(userId, payload) {
  const { event_id } = payload;

  // 1️⃣ Get user blood type
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('blood_type')
    .eq('id', userId)
    .single();

  if (userError || !user?.blood_type) {
    throw { status: 400, message: 'User blood type not set' };
  }

  // 2️⃣ Get event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, status, hospital_id, max_participants, registered_count')
    .eq('id', event_id)
    .single();

  if (eventError || !event) {
    throw { status: 404, message: 'Event not found' };
  }

  if (!['upcoming', 'ongoing'].includes(event.status)) {
    throw { status: 400, message: 'Event not available' };
  }

  if (event.registered_count >= event.max_participants) {
    throw { status: 400, message: 'Event is full' };
  }

  // 3️⃣ Create donation (status = pending)
  const { data: donation, error } = await supabase
    .from('donations')
    .insert({
      user_id: userId,
      event_id,
      hospital_id: event.hospital_id,
      blood_type: user.blood_type,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    // unique (user_id, event_id)
    if (error.code === '23505') {
      throw { status: 400, message: 'Already registered for this event' };
    }
    throw error;
  }

  // 4️⃣ Increment registered_count (atomic)
  await supabase.rpc('increment_event_registration', {
    event_id
  });

  return donation;
}

// ===============================
// USER: MY DONATIONS
// ===============================
export async function myDonations(userId) {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      events(title, event_date),
      hospitals(name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ===============================
// ADMIN: LIST ALL DONATIONS
// ===============================
export async function listDonations() {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      id,
      status,
      quantity_ml,
      created_at,
      users(email, full_name),
      events(title),
      hospitals(name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(d => ({
    id: d.id,
    status: d.status,
    quantity_ml: d.quantity_ml,
    user_email: d.users?.email ?? '-',
    user_name: d.users?.full_name ?? '-',
    event_title: d.events?.title ?? '-',
    hospital_name: d.hospitals?.name ?? '-',
  }));
}


// ===============================
// ADMIN: UPDATE DONATION STATUS
// ===============================
export async function updateDonationStatus(id, payload) {
  const { status, quantity_ml, notes } = payload;

  if (!['completed', 'rejected'].includes(status)) {
    throw { status: 400, message: 'Invalid donation status' };
  }

  const updateData = { status };

  if (status === 'completed') {
    if (!quantity_ml || quantity_ml <= 0) {
      throw { status: 400, message: 'quantity_ml is required' };
    }

    updateData.quantity_ml = quantity_ml;
    updateData.donation_date = new Date();
  }

  if (notes) {
    updateData.notes = notes;
  }

  const { data, error } = await supabase
    .from('donations')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

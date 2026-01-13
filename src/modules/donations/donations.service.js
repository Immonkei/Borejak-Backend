import { supabase } from "../../config/supabase.js";

// ===============================
// USER: CREATE DONATION
// ===============================
export async function createDonation(userId, payload) {
  const { event_id, quantity_ml } = payload;

  // 1️⃣ Get user blood type
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("blood_type")
    .eq("id", userId)
    .single();

  if (userError || !user?.blood_type) {
    throw { status: 400, message: "User blood type not set" };
  }

  // 2️⃣ Get event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, status, hospital_id, max_participants, registered_count")
    .eq("id", event_id)
    .single();

  if (eventError || !event) {
    throw { status: 404, message: "Event not found" };
  }

  if (!["upcoming", "ongoing"].includes(event.status)) {
    throw { status: 400, message: "Event not available" };
  }

  if (
    event.max_participants !== null &&
    event.registered_count >= event.max_participants
  ) {
    throw { status: 400, message: "Event is full" };
  }

  // 🚫 BLOCK donation if user donated in last 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const { data: recentDonation } = await supabase
    .from("donations")
    .select("id, donation_date")
    .eq("user_id", userId)
    .eq("status", "completed")
    .gte("donation_date", threeMonthsAgo)
    .limit(1)
    .maybeSingle();

  if (recentDonation) {
    throw {
      status: 400,
      message: "You can donate only once every 3 months",
    };
  }

  // 3️⃣ Create donation (status = pending)
  const { data: donation, error } = await supabase
    .from("donations")
    .insert({
      user_id: userId,
      event_id,
      hospital_id: event.hospital_id,
      blood_type: user.blood_type,
      quantity_ml,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    // unique (user_id, event_id)
    if (error.code === "23505") {
      throw { status: 400, message: "Already registered for this event" };
    }
    throw error;
  }

  // 4️⃣ Increment registered_count (atomic)
  await supabase.rpc("increment_event_registration", {
    event_id,
  });

  return donation;
}

export async function checkDonationEligibility(userId) {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const { data } = await supabase
    .from("donations")
    .select("donation_date")
    .eq("user_id", userId)
    .eq("status", "completed")
    .gte("donation_date", threeMonthsAgo)
    .limit(1)
    .maybeSingle();

  if (data) {
    const nextDate = new Date(data.donation_date);
    nextDate.setMonth(nextDate.getMonth() + 3);

    return {
      canDonate: false,
      nextDonationDate: nextDate,
    };
  }

  return { canDonate: true };
}

// ===============================
// USER: MY DONATIONS
// ===============================
export async function myDonations(userId) {
  const { data, error } = await supabase
    .from("donations")
    .select(
      `
      *,
      events(title, event_date),
      hospitals(name)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// ===============================
// ADMIN: LIST ALL DONATIONS
// ===============================
export async function listDonations() {
  const { data, error } = await supabase
    .from("donations")
    .select(
      `
      id,
      status,
      quantity_ml,
      blood_type,
      event_id,
      hospital_id,
      created_at,
      users(email, full_name),
      events(id, title),
      hospitals(name)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((d) => ({
    id: d.id,
    status: d.status,
    quantity_ml: d.quantity_ml,
    blood_type: d.blood_type,
    event_id: d.event_id, // ADD THIS
    hospital_id: d.hospital_id, // ADD THIS
    created_at: d.created_at,
    user_email: d.users?.email ?? "-",
    user_name: d.users?.full_name ?? "-",
    event_title: d.events?.title ?? "-",
    hospital_name: d.hospitals?.name ?? "-",
  }));
}

// ===============================
// ADMIN: UPDATE DONATION STATUS
// ===============================
export async function updateDonationStatus(id, payload) {
  const { status, quantity_ml, notes } = payload;

  const allowedStatuses = ["approved", "rejected", "completed"];
  if (!allowedStatuses.includes(status)) {
    throw { status: 400, message: "Invalid donation status" };
  }

  // 1️⃣ Get current donation
  const { data: donation, error: fetchError } = await supabase
    .from("donations")
    .select("status")
    .eq("id", id)
    .single();

  if (fetchError || !donation) {
    throw { status: 404, message: "Donation not found" };
  }

  // 🚫 Prevent completing donation before event date
  if (status === "completed") {
    const { data: donationWithEvent, error } = await supabase
      .from("donations")
      .select(
        `
      events(event_date)
    `
      )
      .eq("id", id)
      .single();

    if (error || !donationWithEvent?.events?.event_date) {
      throw { status: 400, message: "Event date not found" };
    }

    if (new Date(donationWithEvent.events.event_date) > new Date()) {
      throw {
        status: 400,
        message: "Cannot complete donation before event date",
      };
    }
  }

  // 2️⃣ Transition rules
  if (donation.status === "pending") {
    if (!["approved", "rejected"].includes(status)) {
      throw { status: 400, message: "Invalid status transition" };
    }
  }

  if (donation.status === "approved") {
    if (status !== "completed") {
      throw { status: 400, message: "Invalid status transition" };
    }
  }

  if (donation.status === "completed") {
    throw { status: 400, message: "Donation already completed" };
  }

  // 3️⃣ Validate completed
  const updateData = { status };

  if (status === "completed") {
    if (!quantity_ml || quantity_ml <= 0) {
      throw { status: 400, message: "quantity_ml is required" };
    }
    updateData.quantity_ml = quantity_ml;
    updateData.donation_date = new Date();
  }

  if (notes) updateData.notes = notes;

  // 4️⃣ Update
  const { data, error } = await supabase
    .from("donations")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

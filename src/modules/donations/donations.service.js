import { supabase } from "../../config/supabase.js";

// ===============================
// USER: CREATE DONATION
// ===============================
export async function createDonation(userId, payload) {
  const { event_id, quantity_ml } = payload;

  // 1️⃣ Get user blood type + last_donation_date
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("blood_type, last_donation_date")
    .eq("id", userId)
    .single();

  if (userError || !user?.blood_type) {
    throw { status: 400, message: "User blood type not set" };
  }

  // 🔒 90-DAY DONATION RULE (USERS TABLE)
  if (user.last_donation_date) {
    const lastDonation = new Date(user.last_donation_date);
    const daysPassed =
      (Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24);

    if (daysPassed < 90) {
      throw {
        status: 400,
        message: "You must wait 90 days between donations",
      };
    }
  }

  // 2️⃣ Get event (event-based donation)
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

  // 🔧 ATOMIC CHECK: Prevent race condition
  if (event.max_participants !== null && event.registered_count >= event.max_participants) {
    throw { status: 400, message: "Event is full" };
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
    if (error.code === "23505") {
      throw { status: 400, message: "Already registered for this event" };
    }
    throw error;
  }

  // 4️⃣ Increment registered_count
  const { error: rpcError } = await supabase.rpc("increment_event_registration", {
    event_id,
  });

  // 🔧 If increment fails, rollback donation creation
  if (rpcError) {
    await supabase.from("donations").delete().eq("id", donation.id);
    throw { status: 500, message: "Failed to register for event" };
  }

  return donation;
}

// ===============================
// USER: CHECK DONATION ELIGIBILITY
// ===============================
export async function checkDonationEligibility(userId) {
  const { data: user, error } = await supabase
    .from("users")
    .select("last_donation_date")
    .eq("id", userId)
    .single();

  if (error) throw error;

  if (user?.last_donation_date) {
    const lastDonation = new Date(user.last_donation_date);
    const daysPassed =
      (Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24);

    if (daysPassed < 90) {
      const nextDate = new Date(lastDonation);
      nextDate.setDate(nextDate.getDate() + 90);

      return {
        canDonate: false,
        nextDonationDate: nextDate,
      };
    }
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
      events(title, event_date, location),
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
    event_id: d.event_id,
    hospital_id: d.hospital_id,
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

  // 1️⃣ Fetch donation (🔧 include event_id for decrement)
  const { data: donation, error: fetchError } = await supabase
    .from("donations")
    .select("status, user_id, event_id")
    .eq("id", id)
    .single();

  if (fetchError || !donation) {
    throw { status: 404, message: "Donation not found" };
  }

 

  // 2️⃣ Status transition rules
  if (donation.status === "pending" && !["approved", "rejected"].includes(status)) {
    throw { status: 400, message: "Invalid status transition" };
  }

  if (donation.status === "approved" && status !== "completed") {
    throw { status: 400, message: "Invalid status transition" };
  }

  if (donation.status === "completed") {
    throw { status: 400, message: "Donation already completed" };
  }

  // 3️⃣ Prepare update
  const updateData = { status };

  if (status === "completed") {
    if (!quantity_ml || quantity_ml <= 0) {
      throw { status: 400, message: "quantity_ml is required" };
    }
    updateData.quantity_ml = quantity_ml;
    updateData.donation_date = new Date();
  }

  if (notes) updateData.notes = notes;

  // 4️⃣ Update donation
  const { data, error } = await supabase
    .from("donations")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // 5️⃣ UPDATE USER LAST DONATION DATE (CRITICAL)
  if (status === "completed") {
    await supabase
      .from("users")
      .update({ last_donation_date: new Date() })
      .eq("id", donation.user_id);
  }

  // 🔧 6️⃣ DECREMENT registered_count if REJECTED
  if (status === "rejected" && donation.status === "pending" && donation.event_id) {
    await supabase.rpc("decrement_event_registration", {
      event_id: donation.event_id,
    });
  }

  return data;
}
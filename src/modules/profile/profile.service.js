import { supabase } from "../../config/supabase.js";

export async function updateUserProfile(userId, profileData) {
  const { data, error } = await supabase
    .from("users")
    .update({
      ...profileData,
      updated_at: new Date()
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function isProfileCompleted(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("full_name, blood_type, date_of_birth")
    .eq("id", userId)
    .single();

  if (error || !data) return false;

  return Boolean(
    data.full_name &&
    data.blood_type &&
    data.date_of_birth
  );
}
export async function getUserById(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
}


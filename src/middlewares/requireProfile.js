import { supabase } from "../config/supabase.js";

export async function requireProfile(req, res, next) {
  const { userId } = req.user;

  const { data, error } = await supabase
    .from("users")
    .select("full_name, blood_type, date_of_birth")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return res.status(403).json({ message: "User not found" });
  }

  const completed = Boolean(
    data.full_name &&
    data.blood_type &&
    data.date_of_birth
  );

  if (!completed) {
    return res.status(403).json({
      message: "Profile incomplete"
    });
  }

  next();
}

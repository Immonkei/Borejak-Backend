import { supabase } from "../../config/supabase.js";

export async function uploadAvatar(req, res, next) {
  try {
    const { userId } = req.user; // from auth middleware
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Avatar file is required" });
    }

    const filePath = `${userId}/avatar.png`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    res.json({
      success: true,
      avatar_url: data.publicUrl,
    });
  } catch (err) {
    next(err);
  }
}

import { supabase } from "../../config/supabase.js";

export async function uploadEventImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const file = req.file;
    const ext = file.originalname.split(".").pop().toLowerCase();
    const fileName = `${Date.now()}.${ext}`;
    const path = `events/${fileName}`;

    const { error } = await supabase.storage
      .from("event-images")
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const { data } = supabase.storage
      .from("event-images")
      .getPublicUrl(path);

    return res.json({
      success: true,
      data: {
        url: data.publicUrl,
      },
    });
  } catch (err) {
    next(err);
  }
}

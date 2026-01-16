import { supabase } from "../../config/supabase.js";

export async function uploadTipImage(req, res, next) {
  try {
    // ❌ no file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const file = req.file;

    // get extension
    const ext = file.originalname.split(".").pop();

    // unique filename
    const fileName = `tip-${Date.now()}.${ext}`;
    const path = `tips/${fileName}`;

    // upload to Supabase
    const { error } = await supabase.storage
      .from("tip-images")
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw error;
    }

    // get public URL
    const { data } = supabase.storage
      .from("tip-images")
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

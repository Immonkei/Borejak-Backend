import { supabase } from "../../config/supabase.js";

export async function uploadHospitalImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const file = req.file;
    const ext = file.originalname.split(".").pop();
    const fileName = `hospital-${Date.now()}.${ext}`;
    const path = `hospitals/${fileName}`;

    const { error } = await supabase.storage
      .from("hospital-images")
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("hospital-images")
      .getPublicUrl(path);

    res.json({
      success: true,
      data: {
        url: data.publicUrl,
      },
    });
  } catch (err) {
    next(err);
  }
}

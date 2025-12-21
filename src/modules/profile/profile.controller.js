import { updateUserProfile } from "./profile.service.js";
import { getUserById } from "./profile.service.js";

export async function completeProfile(req, res, next) {
  try {
    const { userId } = req.user;

    const {
      full_name,
      phone_number,
      email,
      blood_type,
      date_of_birth,
      gender,
      address,
      avatar_url
    } = req.body;

    if (!full_name || !blood_type || !date_of_birth) {
      return res.status(400).json({
        message: "full_name, blood_type, date_of_birth are required"
      });
    }

    const user = await updateUserProfile(userId, {
      full_name,
      phone_number,
      email,
      blood_type,
      date_of_birth,
      gender,
      address,
      avatar_url
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile_completed: true
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const { userId } = req.user;

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
}
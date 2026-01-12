import jwt from "jsonwebtoken";
import { verifyFirebaseToken, findOrCreateUser } from "./auth.service.js";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role || "user",
    profile_completed: Boolean(
      user.full_name && user.blood_type && user.date_of_birth
    ),
  };
}

export async function login(req, res, next) {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({
        success: false,
        message: "firebaseToken is required",
      });
    }

    const firebaseUser = await verifyFirebaseToken(firebaseToken);
    const user = await findOrCreateUser(firebaseUser);

    const appToken = jwt.sign(
      {
        userId: user.id,
        firebaseUid: user.firebase_uid,
        role: user.role || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      success: true,
      token: appToken,
      user: serializeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const { firebaseToken, phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const firebaseUser = await verifyFirebaseToken(firebaseToken);
    const user = await findOrCreateUser(firebaseUser, { phone_number });

    const token = jwt.sign(
      {
        userId: user.id,
        firebaseUid: user.firebase_uid,
        role: user.role || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: serializeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

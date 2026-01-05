import jwt from 'jsonwebtoken';
import { verifyFirebaseToken, findOrCreateUser } from './auth.service.js';

export async function login(req, res, next) {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({
        success: false,
        message: 'firebaseToken is required'
      });
    }

    // 🔐 Verify Firebase token
    const firebaseUser = await verifyFirebaseToken(firebaseToken);

    // 👤 Find or create user
    const user = await findOrCreateUser(firebaseUser);

    // 🎟️ Generate app JWT
    const appToken = jwt.sign(
      {
        userId: user.id,
        firebaseUid: user.firebase_uid,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const profileCompleted = Boolean(
      user.full_name &&
      user.blood_type &&
      user.date_of_birth
    );

    res.json({
      success: true,
      token: appToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile_completed: profileCompleted
      }
    });
  } catch (err) {
    next(err);
  }
}


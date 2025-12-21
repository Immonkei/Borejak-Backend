import jwt from 'jsonwebtoken';
import { verifyFirebaseToken, findOrCreateUser } from './auth.service.js';

export async function login(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing Authorization header"
      });
    }

    const idToken = authHeader.split(" ")[1];

    const firebaseUser = await verifyFirebaseToken(idToken);
    const user = await findOrCreateUser(firebaseUser);

    const appToken = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
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

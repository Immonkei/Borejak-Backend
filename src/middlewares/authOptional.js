import jwt from "jsonwebtoken";

export default function authOptional(req, res, next) {
  const authHeader = req.headers.authorization;

  // ✅ No token → continue as guest
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔑 Attach user info for controllers
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (err) {
    // ❌ Invalid token → treat as guest (do NOT block)
    return next();
  }
}

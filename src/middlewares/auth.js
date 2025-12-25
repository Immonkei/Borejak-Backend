import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'blood-donation-api',
      audience: 'blood-donation-client'
    });

    // 🔒 Normalize user object (VERY IMPORTANT)
    req.user = {
      userId: decoded.userId,
      firebaseUid: decoded.firebaseUid,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

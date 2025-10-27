import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function authMiddleware(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'access denied' });
  }
  const token = authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userId) {
      next();
    } else {
      res.status(403).json({
        message: 'access denied',
      });
    }
  } catch (err) {
    res.status(403).json({
      message: 'access denied',
    });
  }
}

export { authMiddleware };

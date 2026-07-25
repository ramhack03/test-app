import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
  profileId?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    req.user = decoded;
    
    // Optional profile header attached by frontend requests
    const profileHeader = req.headers['x-profile-id'];
    if (profileHeader && typeof profileHeader === 'string') {
      req.profileId = profileHeader;
    }

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

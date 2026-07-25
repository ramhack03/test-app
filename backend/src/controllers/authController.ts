import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

export const register = (req: Request, res: Response) => {
  const { email, password, planTier } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'User already exists with this email.' });
  }

  const newUser = db.createUser({
    id: `usr-${Date.now()}`,
    email,
    passwordHash: password, // Simple string storage for demo simplicity
    planTier: planTier || 'Standard 1080p',
    createdAt: new Date().toISOString(),
  });

  const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const profiles = db.getProfilesByUserId(newUser.id);

  return res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      planTier: newUser.planTier,
    },
    profiles,
  });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Demo accepts any password if demo user, or exact match
  if (user.email === 'demo@netflix.com' || user.passwordHash === password) {
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const profiles = db.getProfilesByUserId(user.id);

    return res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        planTier: user.planTier,
      },
      profiles,
    });
  }

  return res.status(401).json({ error: 'Invalid email or password.' });
};

export const getCurrentUser = (req: any, res: Response) => {
  const userId = req.user?.userId;
  const user = db.getUserById(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const profiles = db.getProfilesByUserId(userId);

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      planTier: user.planTier,
      createdAt: user.createdAt,
    },
    profiles,
  });
};

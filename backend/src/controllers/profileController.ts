import { Response } from 'express';
import { db } from '../db/db.js';
import { AuthRequest } from '../middleware/auth.js';

export const getProfiles = (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const profiles = db.getProfilesByUserId(userId);
  return res.json({ profiles });
};

export const createProfile = (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { name, avatarUrl, isKids, maturityRating, autoplayNextEpisode, autoplayPreviews, language } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Profile name is required.' });
  }

  const existingProfiles = db.getProfilesByUserId(userId);
  if (existingProfiles.length >= 5) {
    return res.status(400).json({ error: 'Maximum limit of 5 profiles per account reached.' });
  }

  const newProfile = db.createProfile({
    id: `prof-${Date.now()}`,
    userId,
    name,
    avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isKids: !!isKids,
    maturityRating: maturityRating || (isKids ? 'PG' : 'NC-17'),
    autoplayNextEpisode: autoplayNextEpisode !== undefined ? autoplayNextEpisode : true,
    autoplayPreviews: autoplayPreviews !== undefined ? autoplayPreviews : true,
    language: language || 'en',
  });

  return res.status(201).json({ profile: newProfile });
};

export const updateProfile = (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const profile = db.getProfileById(id);
  if (!profile || profile.userId !== userId) {
    return res.status(404).json({ error: 'Profile not found or access denied.' });
  }

  const updated = db.updateProfile(id, req.body);
  return res.json({ profile: updated });
};

export const deleteProfile = (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const profile = db.getProfileById(id);
  if (!profile || profile.userId !== userId) {
    return res.status(404).json({ error: 'Profile not found or access denied.' });
  }

  const success = db.deleteProfile(id);
  return res.json({ success, message: 'Profile deleted successfully.' });
};

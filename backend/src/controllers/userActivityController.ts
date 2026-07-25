import { Response } from 'express';
import { db } from '../db/db.js';
import { AuthRequest } from '../middleware/auth.js';

// --- RATINGS ---
export const getRating = (req: AuthRequest, res: Response) => {
  const profileId = req.profileId || (req.query.profileId as string);
  const movieId = req.params.movieId;

  if (!profileId) return res.status(400).json({ error: 'Profile ID required.' });

  const rating = db.getRating(profileId, movieId);
  return res.json({ rating: rating || null });
};

export const setRating = (req: AuthRequest, res: Response) => {
  const profileId = req.profileId || req.body.profileId;
  const { movieId, ratingType, score } = req.body;

  if (!profileId || !movieId || !ratingType) {
    return res.status(400).json({ error: 'profileId, movieId, and ratingType are required.' });
  }

  const rating = db.setRating(profileId, movieId, ratingType, score);
  return res.json({ message: 'Rating saved successfully', rating });
};

// --- WATCH HISTORY ---
export const getWatchHistory = (req: AuthRequest, res: Response) => {
  const profileId = req.profileId || (req.query.profileId as string);

  if (!profileId) return res.status(400).json({ error: 'Profile ID required.' });

  const history = db.getWatchHistory(profileId);
  return res.json({ watchHistory: history });
};

export const updateWatchHistory = (req: AuthRequest, res: Response) => {
  const profileId = req.profileId || req.body.profileId;
  const { movieId, progressSeconds, durationSeconds } = req.body;

  if (!profileId || !movieId || progressSeconds === undefined) {
    return res.status(400).json({ error: 'profileId, movieId, and progressSeconds are required.' });
  }

  const historyItem = db.updateWatchHistory(
    profileId,
    movieId,
    Number(progressSeconds),
    Number(durationSeconds || 120)
  );

  return res.json({ message: 'Watch history updated', item: historyItem });
};

// --- WATCHLIST (MY LIST) ---
export const getWatchlist = (req: AuthRequest, res: Response) => {
  const profileId = req.profileId || (req.query.profileId as string);

  if (!profileId) return res.status(400).json({ error: 'Profile ID required.' });

  const list = db.getWatchlist(profileId);
  return res.json({ watchlist: list });
};

export const toggleWatchlist = (req: AuthRequest, res: Response) => {
  const profileId = req.profileId || req.body.profileId;
  const { movieId } = req.body;

  if (!profileId || !movieId) {
    return res.status(400).json({ error: 'profileId and movieId are required.' });
  }

  const result = db.toggleWatchlist(profileId, movieId);
  return res.json({
    inList: result.inList,
    message: result.inList ? 'Added to My List' : 'Removed from My List',
  });
};

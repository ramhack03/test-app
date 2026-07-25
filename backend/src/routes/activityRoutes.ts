import { Router } from 'express';
import {
  getRating,
  setRating,
  getWatchHistory,
  updateWatchHistory,
  getWatchlist,
  toggleWatchlist,
} from '../controllers/userActivityController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Ratings
router.get('/ratings/:movieId', getRating);
router.post('/ratings', setRating);

// Watch History
router.get('/history', getWatchHistory);
router.post('/history', updateWatchHistory);

// Watchlist
router.get('/watchlist', getWatchlist);
router.post('/watchlist', toggleWatchlist);

export default router;

import { Router } from 'express';
import { getMovies, getCategories, getMovieById, getFeaturedHero } from '../controllers/movieController.js';

const router = Router();

router.get('/', getMovies);
router.get('/categories', getCategories);
router.get('/hero', getFeaturedHero);
router.get('/:id', getMovieById);

export default router;

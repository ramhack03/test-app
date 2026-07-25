import { Request, Response } from 'express';
import { db } from '../db/db.js';

export const getMovies = (req: Request, res: Response) => {
  const { category, search, isKids } = req.query;
  let movies = db.getMovies();

  // Filter kids content if isKids flag is set
  if (isKids === 'true') {
    movies = movies.filter(m => m.rating === 'G' || m.rating === 'PG' || m.rating === 'TV-Y7');
  }

  // Filter by category slug
  if (category && typeof category === 'string') {
    movies = movies.filter(m => m.categories.includes(category.toLowerCase()));
  }

  // Filter by search query
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    movies = movies.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.castMembers.some(c => c.toLowerCase().includes(q)) ||
      m.director.toLowerCase().includes(q)
    );
  }

  return res.json({ movies });
};

export const getCategories = (req: Request, res: Response) => {
  const categories = db.getCategories();
  const movies = db.getMovies();

  // Attach movie list grouped by category for instant row loading
  const categoriesWithMovies = categories.map(cat => ({
    ...cat,
    movies: movies.filter(m => m.categories.includes(cat.slug)),
  }));

  return res.json({ categories: categoriesWithMovies });
};

export const getMovieById = (req: Request, res: Response) => {
  const { id } = req.params;
  const movie = db.getMovieById(id);

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found.' });
  }

  // Find similar movies in same categories
  const allMovies = db.getMovies();
  const similar = allMovies
    .filter(m => m.id !== movie.id && m.categories.some(c => movie.categories.includes(c)))
    .slice(0, 6);

  return res.json({ movie, similar });
};

export const getFeaturedHero = (req: Request, res: Response) => {
  const movie = db.getFeaturedMovie();
  return res.json({ movie });
};

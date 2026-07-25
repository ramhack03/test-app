export interface User {
  id: string;
  email: string;
  planTier: string;
  createdAt?: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string;
  isKids: boolean;
  maturityRating: string;
  autoplayNextEpisode: boolean;
  autoplayPreviews: boolean;
  language: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  movies?: Movie[];
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  rating: string;
  duration: string;
  matchScore: number;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  videoStreamUrl: string;
  castMembers: string[];
  director: string;
  isFeatured?: boolean;
  isOriginal?: boolean;
  categories: string[];
  viewCount?: number;
}

export interface Rating {
  id: string;
  profileId: string;
  movieId: string;
  ratingType: 'thumbs_up' | 'double_thumbs_up' | 'thumbs_down';
  score?: number;
  updatedAt: string;
}

export interface WatchHistoryItem {
  id: string;
  profileId: string;
  movieId: string;
  progressSeconds: number;
  durationSeconds: number;
  completionPercentage: number;
  isCompleted: boolean;
  lastWatchedAt: string;
  movie?: Movie;
}

export interface WatchlistItem {
  id: string;
  profileId: string;
  movieId: string;
  addedAt: string;
  movie?: Movie;
}

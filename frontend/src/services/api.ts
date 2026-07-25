import { User, Profile, Category, Movie, Rating, WatchHistoryItem, WatchlistItem } from '../types';

const API_BASE = '/api';

const getHeaders = (token?: string | null, profileId?: string | null): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (profileId) {
    headers['x-profile-id'] = profileId;
  }
  return headers;
};

export const api = {
  // --- AUTH ---
  async login(email: string, password: string): Promise<{ token: string; user: User; profiles: Profile[] }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async register(email: string, password: string, planTier?: string): Promise<{ token: string; user: User; profiles: Profile[] }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, planTier }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async getCurrentUser(token: string): Promise<{ user: User; profiles: Profile[] }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
    return data;
  },

  // --- PROFILES ---
  async getProfiles(token: string): Promise<Profile[]> {
    const res = await fetch(`${API_BASE}/profiles`, {
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch profiles');
    return data.profiles;
  },

  async createProfile(token: string, profileData: Partial<Profile>): Promise<Profile> {
    const res = await fetch(`${API_BASE}/profiles`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create profile');
    return data.profile;
  },

  async updateProfile(token: string, profileId: string, updates: Partial<Profile>): Promise<Profile> {
    const res = await fetch(`${API_BASE}/profiles/${profileId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    return data.profile;
  },

  async deleteProfile(token: string, profileId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/profiles/${profileId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete profile');
    return data.success;
  },

  // --- MOVIES & METADATA ---
  async getCategories(isKids?: boolean): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/movies/categories${isKids ? '?isKids=true' : ''}`);
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to fetch categories');
    return data.categories;
  },

  async getHeroMovie(): Promise<Movie> {
    const res = await fetch(`${API_BASE}/movies/hero`);
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to fetch hero movie');
    return data.movie;
  },

  async getMovieById(id: string): Promise<{ movie: Movie; similar: Movie[] }> {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to fetch movie');
    return data;
  },

  async searchMovies(query: string, isKids?: boolean): Promise<Movie[]> {
    const res = await fetch(`${API_BASE}/movies?search=${encodeURIComponent(query)}${isKids ? '&isKids=true' : ''}`);
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to search movies');
    return data.movies;
  },

  // --- USER ACTIVITY ---
  async setRating(token: string, profileId: string, movieId: string, ratingType: 'thumbs_up' | 'double_thumbs_up' | 'thumbs_down', score?: number): Promise<Rating> {
    const res = await fetch(`${API_BASE}/activity/ratings`, {
      method: 'POST',
      headers: getHeaders(token, profileId),
      body: JSON.stringify({ movieId, ratingType, score }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to save rating');
    return data.rating;
  },

  async getWatchHistory(token: string, profileId: string): Promise<WatchHistoryItem[]> {
    const res = await fetch(`${API_BASE}/activity/history?profileId=${profileId}`, {
      headers: getHeaders(token, profileId),
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to fetch watch history');
    return data.watchHistory;
  },

  async updateWatchHistory(token: string, profileId: string, movieId: string, progressSeconds: number, durationSeconds: number): Promise<WatchHistoryItem> {
    const res = await fetch(`${API_BASE}/activity/history`, {
      method: 'POST',
      headers: getHeaders(token, profileId),
      body: JSON.stringify({ movieId, progressSeconds, durationSeconds }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to update watch history');
    return data.item;
  },

  async getWatchlist(token: string, profileId: string): Promise<WatchlistItem[]> {
    const res = await fetch(`${API_BASE}/activity/watchlist?profileId=${profileId}`, {
      headers: getHeaders(token, profileId),
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to fetch watchlist');
    return data.watchlist;
  },

  async toggleWatchlist(token: string, profileId: string, movieId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/activity/watchlist`, {
      method: 'POST',
      headers: getHeaders(token, profileId),
      body: JSON.stringify({ movieId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to toggle watchlist');
    return data.inList;
  },
};

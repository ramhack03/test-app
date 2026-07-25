import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  planTier: string;
  createdAt: string;
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
  categories: string[]; // Category IDs or Slugs
  viewCount: number;
}

export interface Rating {
  id: string;
  profileId: string;
  movieId: string;
  ratingType: 'thumbs_up' | 'double_thumbs_up' | 'thumbs_down';
  score?: number; // 1 to 5
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
}

export interface WatchlistItem {
  id: string;
  profileId: string;
  movieId: string;
  addedAt: string;
}

interface DatabaseData {
  users: User[];
  profiles: Profile[];
  categories: Category[];
  movies: Movie[];
  ratings: Rating[];
  watchHistory: WatchHistoryItem[];
  watchlist: WatchlistItem[];
}

const DATA_DIR = path.join(process.cwd(), 'backend', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-trending', name: 'Trending Now', slug: 'trending', displayOrder: 1 },
  { id: 'cat-action', name: 'Action & Thrillers', slug: 'action', displayOrder: 2 },
  { id: 'cat-scifi', name: 'Sci-Fi & Cyberpunk', slug: 'scifi', displayOrder: 3 },
  { id: 'cat-originals', name: 'Flix Originals', slug: 'originals', displayOrder: 4 },
  { id: 'cat-drama', name: 'Award-Winning Dramas', slug: 'drama', displayOrder: 5 },
  { id: 'cat-comedy', name: 'Comedies & Sitcoms', slug: 'comedy', displayOrder: 6 },
  { id: 'cat-top10', name: 'Top 10 Today', slug: 'top10', displayOrder: 7 },
];

const INITIAL_MOVIES: Movie[] = [
  {
    id: 'm-cyber-pulse',
    title: 'Cyber Pulse 2099',
    description: 'In a rain-slicked neon metropolis, a rogue synth-detective uncovers a conspiracy that spans human consciousness and neural network supremacy.',
    releaseYear: 2025,
    rating: 'TV-MA',
    duration: '2h 18m',
    matchScore: 98,
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    castMembers: ['Kaelen Vance', 'Sora Tanaka', 'Elena Rostova'],
    director: 'Marcus Thorne',
    isFeatured: true,
    isOriginal: true,
    categories: ['trending', 'action', 'scifi', 'originals', 'top10'],
    viewCount: 1420000,
  },
  {
    id: 'm-stellar-odyssey',
    title: 'Stellar Odyssey: Beyond Sol',
    description: 'When humanity receives an encrypted beacon from Alpha Centauri, an elite crew embarks on a high-stakes interstellar maiden voyage.',
    releaseYear: 2024,
    rating: 'PG-13',
    duration: '2h 32m',
    matchScore: 96,
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    castMembers: ['Astrid Lindqvist', 'Devon Brooks', 'Maya Lin'],
    director: 'Guillermo Vance',
    isFeatured: false,
    isOriginal: true,
    categories: ['scifi', 'trending', 'originals'],
    viewCount: 980000,
  },
  {
    id: 'm-neon-shadows',
    title: 'Neon Shadows: Tokyo Heist',
    description: 'An underground crew of high-tech thieves attempts to pull off the ultimate cyber-bank robbery during the annual Shibuya festival.',
    releaseYear: 2024,
    rating: 'TV-MA',
    duration: '1h 55m',
    matchScore: 94,
    posterUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    castMembers: ['Kenji Sato', 'Aria Montgomery', 'Zack Miller'],
    director: 'Hideo Nakamoto',
    isFeatured: false,
    isOriginal: false,
    categories: ['action', 'trending', 'top10'],
    viewCount: 850000,
  },
  {
    id: 'm-crown-of-thornes',
    title: 'Crown of Thrones & Ashes',
    description: 'In an ancient realm fractured by political betrayals and dark sorcery, three royal houses wage war for the obsidian throne.',
    releaseYear: 2023,
    rating: 'TV-MA',
    duration: '3 Seasons',
    matchScore: 99,
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    castMembers: ['Charles Sterling', 'Lady Evelyn Vance', 'Garrick Storm'],
    director: 'David Benioff',
    isFeatured: false,
    isOriginal: true,
    categories: ['drama', 'trending', 'originals', 'top10'],
    viewCount: 2300000,
  },
  {
    id: 'm-quantum-code',
    title: 'The Quantum Paradox',
    description: 'A brilliant theoretical physicist builds a device that accesses parallel dimensions, only to find an alternate version of herself hunting her down.',
    releaseYear: 2025,
    rating: 'PG-13',
    duration: '2h 05m',
    matchScore: 92,
    posterUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    castMembers: ['Dr. Sophia Ross', 'Julian Kross', 'Nolan Drake'],
    director: 'Christopher Nolan',
    isFeatured: false,
    isOriginal: false,
    categories: ['scifi', 'drama'],
    viewCount: 620000,
  },
  {
    id: 'm-laughter-protocol',
    title: 'The Laugh Protocol',
    description: 'When an AI companion gains a sarcastic sense of humor, it turns a chaotic Silicon Valley startup upside down with viral antics.',
    releaseYear: 2024,
    rating: 'TV-14',
    duration: '1h 38m',
    matchScore: 89,
    posterUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    castMembers: ['Sammy Jay', 'Priya Patel', 'Leo Martinez'],
    director: 'Taika Waititi',
    isFeatured: false,
    isOriginal: true,
    categories: ['comedy', 'trending', 'originals'],
    viewCount: 710000,
  },
  {
    id: 'm-deep-ocean-secrets',
    title: 'Deep Abyss: Mysteries of the Trench',
    description: 'Explore the uncharted Mariana Trench where strange bioluminescent species and ancient volcanic thermal vents redefine marine science.',
    releaseYear: 2023,
    rating: 'G',
    duration: '1h 45m',
    matchScore: 97,
    posterUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    castMembers: ['David Attenborough', 'Dr. Sylvia Earle'],
    director: 'James Cameron',
    isFeatured: false,
    isOriginal: true,
    categories: ['drama', 'top10', 'originals'],
    viewCount: 1100000,
  },
  {
    id: 'm-velocity-overdrive',
    title: 'Velocity: Overdrive',
    description: 'An ex-Formula 1 driver is forced into illegal underground night races to dismantle a global smuggling syndicate.',
    releaseYear: 2025,
    rating: 'PG-13',
    duration: '2h 10m',
    matchScore: 91,
    posterUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    castMembers: ['Dom Toretto Jr.', 'Elena Reyes', 'Lucas Black'],
    director: 'Justin Lin',
    isFeatured: false,
    isOriginal: false,
    categories: ['action', 'trending'],
    viewCount: 890000,
  }
];

class JsonDatabase {
  private data: DatabaseData;

  constructor() {
    this.data = {
      users: [],
      profiles: [],
      categories: INITIAL_CATEGORIES,
      movies: INITIAL_MOVIES,
      ratings: [],
      watchHistory: [],
      watchlist: [],
    };
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          ...this.data,
          ...parsed,
          categories: parsed.categories?.length ? parsed.categories : INITIAL_CATEGORIES,
          movies: parsed.movies?.length ? parsed.movies : INITIAL_MOVIES,
        };
      } else {
        // Seed default user and profiles
        const defaultUser: User = {
          id: 'usr-demo-123',
          email: 'demo@netflix.com',
          // Password: "password123" (bcrypt hash or test string)
          passwordHash: '$2a$10$wT4Y8i4A0h2eK9B4G1u6O.k9SgLdE0F2h1j3k4l5m6n7o8p9q0r1', // demo dummy
          planTier: 'Premium 4K HDR',
          createdAt: new Date().toISOString(),
        };

        const defaultProfiles: Profile[] = [
          {
            id: 'prof-alex',
            userId: 'usr-demo-123',
            name: 'Alex',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            isKids: false,
            maturityRating: 'NC-17',
            autoplayNextEpisode: true,
            autoplayPreviews: true,
            language: 'en',
          },
          {
            id: 'prof-kids',
            userId: 'usr-demo-123',
            name: 'Kids World',
            avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
            isKids: true,
            maturityRating: 'PG',
            autoplayNextEpisode: true,
            autoplayPreviews: false,
            language: 'en',
          },
          {
            id: 'prof-sam',
            userId: 'usr-demo-123',
            name: 'Sam & Family',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            isKids: false,
            maturityRating: 'TV-MA',
            autoplayNextEpisode: true,
            autoplayPreviews: true,
            language: 'en',
          }
        ];

        this.data.users.push(defaultUser);
        this.data.profiles.push(...defaultProfiles);
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save DB file:', err);
    }
  }

  // --- USER API ---
  public getUsers(): User[] { return this.data.users; }
  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }
  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }
  public createUser(user: User): User {
    this.data.users.push(user);
    // Create default profile for new user
    const defaultProfile: Profile = {
      id: `prof-${Date.now()}`,
      userId: user.id,
      name: user.email.split('@')[0],
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isKids: false,
      maturityRating: 'NC-17',
      autoplayNextEpisode: true,
      autoplayPreviews: true,
      language: 'en',
    };
    this.data.profiles.push(defaultProfile);
    this.save();
    return user;
  }

  // --- PROFILES API ---
  public getProfilesByUserId(userId: string): Profile[] {
    return this.data.profiles.filter(p => p.userId === userId);
  }
  public getProfileById(id: string): Profile | undefined {
    return this.data.profiles.find(p => p.id === id);
  }
  public createProfile(profile: Profile): Profile {
    this.data.profiles.push(profile);
    this.save();
    return profile;
  }
  public updateProfile(id: string, updates: Partial<Profile>): Profile | undefined {
    const idx = this.data.profiles.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    this.data.profiles[idx] = { ...this.data.profiles[idx], ...updates };
    this.save();
    return this.data.profiles[idx];
  }
  public deleteProfile(id: string): boolean {
    const initialLen = this.data.profiles.length;
    this.data.profiles = this.data.profiles.filter(p => p.id !== id);
    if (this.data.profiles.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- MOVIES & CATEGORIES API ---
  public getCategories(): Category[] { return this.data.categories; }
  public getMovies(): Movie[] { return this.data.movies; }
  public getMovieById(id: string): Movie | undefined {
    return this.data.movies.find(m => m.id === id);
  }
  public getFeaturedMovie(): Movie {
    return this.data.movies.find(m => m.isFeatured) || this.data.movies[0];
  }

  // --- RATINGS API ---
  public getRating(profileId: string, movieId: string): Rating | undefined {
    return this.data.ratings.find(r => r.profileId === profileId && r.movieId === movieId);
  }
  public setRating(profileId: string, movieId: string, ratingType: 'thumbs_up' | 'double_thumbs_up' | 'thumbs_down', score?: number): Rating {
    const existingIdx = this.data.ratings.findIndex(r => r.profileId === profileId && r.movieId === movieId);
    const now = new Date().toISOString();
    if (existingIdx !== -1) {
      this.data.ratings[existingIdx] = {
        ...this.data.ratings[existingIdx],
        ratingType,
        score,
        updatedAt: now,
      };
      this.save();
      return this.data.ratings[existingIdx];
    } else {
      const newRating: Rating = {
        id: `rat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        profileId,
        movieId,
        ratingType,
        score: score || 5,
        updatedAt: now,
      };
      this.data.ratings.push(newRating);
      this.save();
      return newRating;
    }
  }

  // --- WATCH HISTORY API ---
  public getWatchHistory(profileId: string): (WatchHistoryItem & { movie?: Movie })[] {
    return this.data.watchHistory
      .filter(w => w.profileId === profileId)
      .sort((a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime())
      .map(w => ({
        ...w,
        movie: this.getMovieById(w.movieId),
      }));
  }
  public updateWatchHistory(profileId: string, movieId: string, progressSeconds: number, durationSeconds: number): WatchHistoryItem {
    const existingIdx = this.data.watchHistory.findIndex(w => w.profileId === profileId && w.movieId === movieId);
    const percentage = durationSeconds > 0 ? (progressSeconds / durationSeconds) * 100 : 0;
    const isCompleted = percentage >= 90;
    const now = new Date().toISOString();

    if (existingIdx !== -1) {
      this.data.watchHistory[existingIdx] = {
        ...this.data.watchHistory[existingIdx],
        progressSeconds,
        durationSeconds,
        completionPercentage: Math.round(percentage),
        isCompleted,
        lastWatchedAt: now,
      };
      this.save();
      return this.data.watchHistory[existingIdx];
    } else {
      const newItem: WatchHistoryItem = {
        id: `wh-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        profileId,
        movieId,
        progressSeconds,
        durationSeconds,
        completionPercentage: Math.round(percentage),
        isCompleted,
        lastWatchedAt: now,
      };
      this.data.watchHistory.push(newItem);
      this.save();
      return newItem;
    }
  }

  // --- WATCHLIST (MY LIST) API ---
  public getWatchlist(profileId: string): (WatchlistItem & { movie?: Movie })[] {
    return this.data.watchlist
      .filter(wl => wl.profileId === profileId)
      .map(wl => ({
        ...wl,
        movie: this.getMovieById(wl.movieId),
      }));
  }
  public toggleWatchlist(profileId: string, movieId: string): { inList: boolean; item?: WatchlistItem } {
    const existingIdx = this.data.watchlist.findIndex(wl => wl.profileId === profileId && wl.movieId === movieId);
    if (existingIdx !== -1) {
      this.data.watchlist.splice(existingIdx, 1);
      this.save();
      return { inList: false };
    } else {
      const newItem: WatchlistItem = {
        id: `wl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        profileId,
        movieId,
        addedAt: new Date().toISOString(),
      };
      this.data.watchlist.push(newItem);
      this.save();
      return { inList: true, item: newItem };
    }
  }
}

export const db = new JsonDatabase();

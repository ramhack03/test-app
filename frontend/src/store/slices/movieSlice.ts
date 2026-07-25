import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category, Movie, Rating, WatchHistoryItem, WatchlistItem } from '../../types';
import { api } from '../../services/api';
import { RootState } from '../index';

interface MovieState {
  heroMovie: Movie | null;
  categories: Category[];
  selectedCategory: string; // 'all' | slug
  searchQuery: string;
  searchResults: Movie[];
  selectedMovie: Movie | null;
  playingMovie: Movie | null;
  watchHistory: WatchHistoryItem[];
  watchlist: WatchlistItem[];
  ratingsMap: Record<string, Rating>; // movieId -> Rating
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  heroMovie: null,
  categories: [],
  selectedCategory: 'all',
  searchQuery: '',
  searchResults: [],
  selectedMovie: null,
  playingMovie: null,
  watchHistory: [],
  watchlist: [],
  ratingsMap: {},
  loading: false,
  error: null,
};

export const fetchCatalog = createAsyncThunk(
  'movies/fetchCatalog',
  async (isKids: boolean, { rejectWithValue }) => {
    try {
      const [hero, categories] = await Promise.all([
        api.getHeroMovie(),
        api.getCategories(isKids),
      ]);
      return { hero, categories };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch catalog');
    }
  }
);

export const searchMovieCatalog = createAsyncThunk(
  'movies/search',
  async ({ query, isKids }: { query: string; isKids: boolean }, { rejectWithValue }) => {
    if (!query.trim()) return [];
    try {
      return await api.searchMovies(query, isKids);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Search failed');
    }
  }
);

export const fetchUserActivityData = createAsyncThunk(
  'movies/fetchUserActivity',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const profileId = state.profile.activeProfile?.id;
    if (!token || !profileId) return { history: [], watchlist: [] };
    try {
      const [history, watchlist] = await Promise.all([
        api.getWatchHistory(token, profileId),
        api.getWatchlist(token, profileId),
      ]);
      return { history, watchlist };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveMovieRating = createAsyncThunk(
  'movies/saveRating',
  async ({ movieId, ratingType, score }: { movieId: string; ratingType: 'thumbs_up' | 'double_thumbs_up' | 'thumbs_down'; score?: number }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const profileId = state.profile.activeProfile?.id;
    if (!token || !profileId) return rejectWithValue('Not authenticated');
    try {
      const rating = await api.setRating(token, profileId, movieId, ratingType, score);
      return rating;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateWatchProgress = createAsyncThunk(
  'movies/updateWatchProgress',
  async ({ movieId, progressSeconds, durationSeconds }: { movieId: string; progressSeconds: number; durationSeconds: number }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const profileId = state.profile.activeProfile?.id;
    if (!token || !profileId) return;
    try {
      const item = await api.updateWatchHistory(token, profileId, movieId, progressSeconds, durationSeconds);
      dispatch(fetchUserActivityData());
      return item;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleMyList = createAsyncThunk(
  'movies/toggleMyList',
  async (movieId: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const profileId = state.profile.activeProfile?.id;
    if (!token || !profileId) return rejectWithValue('Not authenticated');
    try {
      await api.toggleWatchlist(token, profileId, movieId);
      dispatch(fetchUserActivityData());
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedMovie(state, action: PayloadAction<Movie | null>) {
      state.selectedMovie = action.payload;
    },
    setPlayingMovie(state, action: PayloadAction<Movie | null>) {
      state.playingMovie = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.loading = false;
        state.heroMovie = action.payload.hero;
        state.categories = action.payload.categories;
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchMovieCatalog.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(fetchUserActivityData.fulfilled, (state, action) => {
        state.watchHistory = action.payload.history;
        state.watchlist = action.payload.watchlist;
      })
      .addCase(saveMovieRating.fulfilled, (state, action) => {
        if (action.payload) {
          state.ratingsMap[action.payload.movieId] = action.payload;
        }
      });
  },
});

export const { setSelectedCategory, setSearchQuery, setSelectedMovie, setPlayingMovie } = movieSlice.actions;
export default movieSlice.reducer;

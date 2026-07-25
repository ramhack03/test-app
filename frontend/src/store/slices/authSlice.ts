import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Profile } from '../../types';
import { api } from '../../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  profiles: Profile[];
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialToken = typeof window !== 'undefined' ? localStorage.getItem('netflix_token') : null;

const initialState: AuthState = {
  user: null,
  token: initialToken,
  profiles: [],
  isAuthenticated: false, // Will verify on app boot
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem('netflix_token', data.token);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, planTier }: { email: string; password: string; planTier?: string }, { rejectWithValue }) => {
    try {
      const data = await api.register(email, password, planTier);
      localStorage.setItem('netflix_token', data.token);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    let token = state.auth.token || (typeof window !== 'undefined' ? localStorage.getItem('netflix_token') : null);

    if (!token) {
      try {
        const demoData = await api.login('demo@netflix.com', 'password123');
        if (typeof window !== 'undefined') {
          localStorage.setItem('netflix_token', demoData.token);
        }
        return { token: demoData.token, user: demoData.user, profiles: demoData.profiles };
      } catch (err: any) {
        return rejectWithValue('No token found');
      }
    }

    try {
      const data = await api.getCurrentUser(token);
      return { token, user: data.user, profiles: data.profiles };
    } catch (err: any) {
      // If saved token is expired or invalid, auto-login as demo user
      try {
        const demoData = await api.login('demo@netflix.com', 'password123');
        if (typeof window !== 'undefined') {
          localStorage.setItem('netflix_token', demoData.token);
        }
        return { token: demoData.token, user: demoData.user, profiles: demoData.profiles };
      } catch (e) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('netflix_token');
        }
        return rejectWithValue('Session expired');
      }
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.profiles = [];
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('netflix_token');
      localStorage.removeItem('netflix_active_profile_id');
    },
    clearAuthError(state) {
      state.error = null;
    },
    setProfilesList(state, action: PayloadAction<Profile[]>) {
      state.profiles = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.profiles = action.payload.profiles;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.profiles = action.payload.profiles;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.profiles = action.payload.profiles;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearAuthError, setProfilesList } = authSlice.actions;
export default authSlice.reducer;

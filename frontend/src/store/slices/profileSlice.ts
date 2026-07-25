import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '../../types';
import { api } from '../../services/api';
import { RootState } from '../index';
import { setProfilesList } from './authSlice';

interface ProfileState {
  activeProfile: Profile | null;
  profiles: Profile[];
  isManaging: boolean;
  editingProfile: Profile | null;
  loading: boolean;
  error: string | null;
}

const savedProfileId = typeof window !== 'undefined' ? localStorage.getItem('netflix_active_profile_id') : null;

const initialState: ProfileState = {
  activeProfile: null,
  profiles: [],
  isManaging: false,
  editingProfile: null,
  loading: false,
  error: null,
};

export const createNewProfile = createAsyncThunk(
  'profile/create',
  async (profileData: Partial<Profile>, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    let token = state.auth.token || (typeof window !== 'undefined' ? localStorage.getItem('netflix_token') : null);

    if (!token) {
      try {
        const demo = await api.login('demo@netflix.com', 'password123');
        token = demo.token;
        if (typeof window !== 'undefined') localStorage.setItem('netflix_token', demo.token);
        dispatch(setProfilesList(demo.profiles));
      } catch (e) {
        // Create local profile fallback if backend is unreachable
        const fallbackProfile: Profile = {
          id: `prof-${Date.now()}`,
          userId: 'usr-demo-123',
          name: profileData.name || 'New Profile',
          avatarUrl: profileData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isKids: !!profileData.isKids,
          maturityRating: profileData.maturityRating || (profileData.isKids ? 'PG' : 'NC-17'),
          autoplayNextEpisode: profileData.autoplayNextEpisode ?? true,
          autoplayPreviews: profileData.autoplayPreviews ?? true,
          language: profileData.language || 'en',
        };
        const updatedList = [...state.profile.profiles, fallbackProfile];
        dispatch(setProfilesList(updatedList));
        return fallbackProfile;
      }
    }

    try {
      const newProfile = await api.createProfile(token, profileData);
      const updatedList = [...state.profile.profiles, newProfile];
      dispatch(setProfilesList(updatedList));
      return newProfile;
    } catch (err: any) {
      // Fallback: create client profile if server call fails
      const fallbackProfile: Profile = {
        id: `prof-${Date.now()}`,
        userId: 'usr-demo-123',
        name: profileData.name || 'New Profile',
        avatarUrl: profileData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isKids: !!profileData.isKids,
        maturityRating: profileData.maturityRating || (profileData.isKids ? 'PG' : 'NC-17'),
        autoplayNextEpisode: profileData.autoplayNextEpisode ?? true,
        autoplayPreviews: profileData.autoplayPreviews ?? true,
        language: profileData.language || 'en',
      };
      const updatedList = [...state.profile.profiles, fallbackProfile];
      dispatch(setProfilesList(updatedList));
      return fallbackProfile;
    }
  }
);

export const updateProfileSettings = createAsyncThunk(
  'profile/updateSettings',
  async ({ profileId, updates }: { profileId: string; updates: Partial<Profile> }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token || (typeof window !== 'undefined' ? localStorage.getItem('netflix_token') : null);
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const updated = await api.updateProfile(token, profileId, updates);
      const updatedProfiles = state.profile.profiles.map(p => p.id === profileId ? updated : p);
      dispatch(setProfilesList(updatedProfiles));
      return updated;
    } catch (err: any) {
      // Fallback to local state update
      const existing = state.profile.profiles.find(p => p.id === profileId);
      if (!existing) return rejectWithValue('Profile not found');
      const updated = { ...existing, ...updates };
      const updatedProfiles = state.profile.profiles.map(p => p.id === profileId ? updated : p);
      dispatch(setProfilesList(updatedProfiles));
      return updated;
    }
  }
);

export const deleteUserProfile = createAsyncThunk(
  'profile/delete',
  async (profileId: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token || (typeof window !== 'undefined' ? localStorage.getItem('netflix_token') : null);
    if (!token) {
      const remaining = state.profile.profiles.filter(p => p.id !== profileId);
      dispatch(setProfilesList(remaining));
      return profileId;
    }
    try {
      await api.deleteProfile(token, profileId);
      const remaining = state.profile.profiles.filter(p => p.id !== profileId);
      dispatch(setProfilesList(remaining));
      return profileId;
    } catch (err: any) {
      const remaining = state.profile.profiles.filter(p => p.id !== profileId);
      dispatch(setProfilesList(remaining));
      return profileId;
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setActiveProfile(state, action: PayloadAction<Profile | null>) {
      state.activeProfile = action.payload;
      if (action.payload) {
        localStorage.setItem('netflix_active_profile_id', action.payload.id);
      } else {
        localStorage.removeItem('netflix_active_profile_id');
      }
    },
    syncProfiles(state, action: PayloadAction<Profile[]>) {
      state.profiles = action.payload;
      if (savedProfileId && !state.activeProfile) {
        const found = action.payload.find(p => p.id === savedProfileId);
        if (found) {
          state.activeProfile = found;
        }
      }
    },
    setManaging(state, action: PayloadAction<boolean>) {
      state.isManaging = action.payload;
    },
    setEditingProfile(state, action: PayloadAction<Profile | null>) {
      state.editingProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewProfile.fulfilled, (state, action) => {
        state.profiles.push(action.payload);
        state.isManaging = false;
      })
      .addCase(updateProfileSettings.fulfilled, (state, action) => {
        const idx = state.profiles.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.profiles[idx] = action.payload;
        if (state.activeProfile?.id === action.payload.id) {
          state.activeProfile = action.payload;
        }
        state.editingProfile = null;
        state.isManaging = false;
      })
      .addCase(deleteUserProfile.fulfilled, (state, action) => {
        state.profiles = state.profiles.filter(p => p.id !== action.payload);
        if (state.activeProfile?.id === action.payload) {
          state.activeProfile = state.profiles[0] || null;
        }
        state.editingProfile = null;
      });
  }
});

export const { setActiveProfile, syncProfiles, setManaging, setEditingProfile } = profileSlice.actions;
export default profileSlice.reducer;

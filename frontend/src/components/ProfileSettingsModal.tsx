import React, { useState } from 'react';
import { X, Trash2, Check, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateProfileSettings, deleteUserProfile, setEditingProfile } from '../store/slices/profileSlice';

export const ProfileSettingsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { editingProfile } = useAppSelector(state => state.profile);

  if (!editingProfile) return null;

  const [name, setName] = useState(editingProfile.name);
  const [maturityRating, setMaturityRating] = useState(editingProfile.maturityRating);
  const [autoplayNextEpisode, setAutoplayNextEpisode] = useState(editingProfile.autoplayNextEpisode);
  const [autoplayPreviews, setAutoplayPreviews] = useState(editingProfile.autoplayPreviews);
  const [isKids, setIsKids] = useState(editingProfile.isKids);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfileSettings({
      profileId: editingProfile.id,
      updates: {
        name,
        maturityRating,
        autoplayNextEpisode,
        autoplayPreviews,
        isKids,
      }
    }));
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete profile "${editingProfile.name}"?`)) {
      dispatch(deleteUserProfile(editingProfile.id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-6 text-white space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <img src={editingProfile.avatarUrl} className="w-10 h-10 rounded object-cover" />
            <div>
              <h2 className="text-lg font-bold text-white">Edit Profile Settings</h2>
              <span className="text-xs text-zinc-500 font-mono">Redux State Managed</span>
            </div>
          </div>
          <button
            onClick={() => dispatch(setEditingProfile(null))}
            className="p-1.5 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          
          {/* Profile Name Input */}
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Profile Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600"
              required
            />
          </div>

          {/* Maturity Rating Level */}
          <div>
            <label className="block text-zinc-400 font-semibold mb-1 flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>Maturity Rating Level</span>
            </label>
            <select
              value={maturityRating}
              onChange={(e) => setMaturityRating(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
            >
              <option value="G">G - All Ages</option>
              <option value="PG">PG - Parental Guidance</option>
              <option value="PG-13">PG-13 - Teens 13+</option>
              <option value="TV-MA">TV-MA - Mature Adults 17+</option>
              <option value="NC-17">NC-17 - Unrestricted All Titles</option>
            </select>
          </div>

          {/* Autoplay Controls */}
          <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-3">
            <span className="font-bold text-zinc-300 block uppercase tracking-wider text-[10px]">
              Playback Autoplay Controls
            </span>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-zinc-300">Autoplay next episode automatically</span>
              <input
                type="checkbox"
                checked={autoplayNextEpisode}
                onChange={(e) => setAutoplayNextEpisode(e.target.checked)}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-zinc-300">Autoplay trailer previews while browsing</span>
              <input
                type="checkbox"
                checked={autoplayPreviews}
                onChange={(e) => setAutoplayPreviews(e.target.checked)}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center space-x-1.5 text-red-400 hover:text-red-300 text-xs font-bold"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Profile</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => dispatch(setEditingProfile(null))}
                className="px-4 py-2 font-bold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-bold transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

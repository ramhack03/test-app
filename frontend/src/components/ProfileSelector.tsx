import React, { useState } from 'react';
import { Plus, Edit2, Lock, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setActiveProfile, setManaging, createNewProfile, setEditingProfile } from '../store/slices/profileSlice';

export const ProfileSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profiles, isManaging } = useAppSelector(state => state.profile);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isKids, setIsKids] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  ];
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    setIsSubmitting(true);
    setAddError(null);

    try {
      const res = await dispatch(createNewProfile({
        name: newProfileName.trim(),
        avatarUrl: selectedAvatar,
        isKids,
        maturityRating: isKids ? 'PG' : 'NC-17',
        autoplayNextEpisode: true,
        autoplayPreviews: true,
        language: 'en',
      }));

      setIsSubmitting(false);

      if (createNewProfile.fulfilled.match(res)) {
        setNewProfileName('');
        setShowAddModal(false);
      } else {
        setAddError((res.payload as string) || 'Failed to create profile');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setAddError(err.message || 'Failed to create profile');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-white select-none animate-fade-in">
      
      {/* Brand Logo Header */}
      <div className="absolute top-8 left-8 flex items-center space-x-2">
        <span className="text-red-600 font-black text-3xl tracking-tighter uppercase font-mono">
          FLIXSTREAM
        </span>
      </div>

      <div className="max-w-4xl w-full text-center space-y-10">
        
        {/* Title Header */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-100">
          {isManaging ? 'Manage Profiles' : "Who's watching?"}
        </h1>

        {/* Profiles Grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex flex-col items-center space-y-3 group cursor-pointer"
              onClick={() => {
                if (isManaging) {
                  dispatch(setEditingProfile(profile));
                } else {
                  dispatch(setActiveProfile(profile));
                }
              }}
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-white transition-all shadow-xl group-hover:scale-105">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className={`w-full h-full object-cover ${isManaging ? 'brightness-50' : ''}`}
                />

                {/* Edit overlay icon when in manage mode */}
                {isManaging && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Edit2 className="w-8 h-8 text-white drop-shadow" />
                  </div>
                )}

                {profile.isKids && (
                  <span className="absolute bottom-1 right-1 bg-yellow-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                    KIDS
                  </span>
                )}
              </div>

              <span className="text-sm sm:text-base font-bold text-zinc-400 group-hover:text-white transition-colors">
                {profile.name}
              </span>
            </div>
          ))}

          {/* Add Profile Tile */}
          {profiles.length < 5 && (
            <div
              onClick={() => setShowAddModal(true)}
              className="flex flex-col items-center space-y-3 group cursor-pointer"
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-lg border-2 border-dashed border-zinc-700 group-hover:border-zinc-400 bg-zinc-900/50 flex items-center justify-center transition-all group-hover:scale-105">
                <Plus className="w-12 h-12 text-zinc-500 group-hover:text-zinc-300" />
              </div>
              <span className="text-sm sm:text-base font-bold text-zinc-500 group-hover:text-zinc-300">
                Add Profile
              </span>
            </div>
          )}
        </div>

        {/* Manage Profiles Action Button */}
        <div>
          <button
            onClick={() => dispatch(setManaging(!isManaging))}
            className={`border px-6 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors ${isManaging ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-400 hover:border-zinc-400 hover:text-white'}`}
          >
            {isManaging ? 'Done' : 'Manage Profiles'}
          </button>
        </div>

      </div>

      {/* Add Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white">Add New Profile</h2>

            <form onSubmit={handleAddProfile} className="space-y-4">
              {addError && (
                <div className="bg-red-950/80 border border-red-800 text-red-200 text-xs p-3 rounded-lg flex items-center justify-between">
                  <span>{addError}</span>
                  <button type="button" onClick={() => setAddError(null)} className="text-red-400 hover:text-white">✕</button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Profile Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex, Sarah"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">Choose Avatar</label>
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {AVATARS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      onClick={() => setSelectedAvatar(url)}
                      className={`w-12 h-12 rounded cursor-pointer object-cover border-2 transition-all ${selectedAvatar === url ? 'border-red-600 scale-105' : 'border-transparent opacity-60'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between bg-zinc-950 p-3 rounded border border-zinc-800">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Kids Experience?</span>
                  <span className="text-[10px] text-zinc-500 block">Only shows TV-PG and below titles</span>
                </div>
                <input
                  type="checkbox"
                  checked={isKids}
                  onChange={(e) => setIsKids(e.target.checked)}
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2 rounded text-xs font-bold transition-colors"
                >
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

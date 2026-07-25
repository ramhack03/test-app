import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut, Film, Code, History, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/slices/authSlice';
import { setActiveProfile, setManaging, setEditingProfile } from '../store/slices/profileSlice';
import { setSelectedCategory, setSearchQuery } from '../store/slices/movieSlice';

interface NavbarProps {
  activeTab: 'home' | 'tv' | 'movies' | 'new' | 'my-list' | 'history' | 'repo-explorer';
  setActiveTab: (tab: 'home' | 'tv' | 'movies' | 'new' | 'my-list' | 'history' | 'repo-explorer') => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, profiles } = useAppSelector(state => state.auth);
  const { activeProfile } = useAppSelector(state => state.profile);
  const { searchQuery } = useAppSelector(state => state.movie);

  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${isScrolled ? 'bg-zinc-950/95 backdrop-blur-md shadow-2xl border-b border-zinc-900' : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Section: Logo & Navigation Tabs */}
        <div className="flex items-center space-x-8">
          <div 
            onClick={() => { setActiveTab('home'); dispatch(setSelectedCategory('all')); }}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <span className="text-red-600 font-black text-2xl tracking-tighter uppercase font-mono group-hover:scale-105 transition-transform">
              FLIXSTREAM
            </span>
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              PLUS
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-5 text-sm font-medium text-zinc-300">
            <button
              onClick={() => { setActiveTab('home'); dispatch(setSelectedCategory('all')); }}
              className={`hover:text-white transition-colors ${activeTab === 'home' ? 'text-white font-bold' : 'text-zinc-400'}`}
            >
              Home
            </button>
            <button
              onClick={() => { setActiveTab('tv'); dispatch(setSelectedCategory('drama')); }}
              className={`hover:text-white transition-colors ${activeTab === 'tv' ? 'text-white font-bold' : 'text-zinc-400'}`}
            >
              TV Shows
            </button>
            <button
              onClick={() => { setActiveTab('movies'); dispatch(setSelectedCategory('action')); }}
              className={`hover:text-white transition-colors ${activeTab === 'movies' ? 'text-white font-bold' : 'text-zinc-400'}`}
            >
              Movies
            </button>
            <button
              onClick={() => { setActiveTab('new'); dispatch(setSelectedCategory('trending')); }}
              className={`hover:text-white transition-colors ${activeTab === 'new' ? 'text-white font-bold' : 'text-zinc-400'}`}
            >
              New & Popular
            </button>
            <button
              onClick={() => setActiveTab('my-list')}
              className={`hover:text-white transition-colors ${activeTab === 'my-list' ? 'text-white font-bold' : 'text-zinc-400'}`}
            >
              My List
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`hover:text-white transition-colors flex items-center space-x-1 ${activeTab === 'history' ? 'text-white font-bold' : 'text-zinc-400'}`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Watch History</span>
            </button>
          </nav>
        </div>

        {/* Right Section: Repo Switcher, Search, Profile Dropdown */}
        <div className="flex items-center space-x-4">
          
          {/* Dual Repository Code Inspector Button */}
          <button
            onClick={() => setActiveTab('repo-explorer')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${activeTab === 'repo-explorer' ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/40' : 'bg-zinc-900/80 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800'}`}
            title="Inspect Frontend & Backend Repositories"
          >
            <Code className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">Repo Inspector</span>
          </button>

          {/* Search Bar */}
          <div className="relative flex items-center">
            {showSearch ? (
              <div className="flex items-center bg-zinc-900/90 border border-zinc-700 rounded-full px-3 py-1">
                <Search className="w-4 h-4 text-zinc-400 mr-2" />
                <input
                  type="text"
                  placeholder="Titles, actors, genres..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                  className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-32 sm:w-48"
                  onBlur={() => { if (!searchQuery) setShowSearch(false); }}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-zinc-800/60"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Notifications */}
          <button className="p-2 text-zinc-300 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          </button>

          {/* Profile Dropdown or Sign In */}
          {isAuthenticated && activeProfile ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 focus:outline-none group"
              >
                <img
                  src={activeProfile.avatarUrl}
                  alt={activeProfile.name}
                  className="w-8 h-8 rounded border-2 border-transparent group-hover:border-red-600 object-cover transition-colors"
                />
                <ChevronDown className={`w-4 h-4 text-zinc-400 group-hover:text-white transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Menu Popup */}
              {showProfileDropdown && (
                <div 
                  className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl py-2 z-50 text-xs text-zinc-300"
                  onMouseLeave={() => setShowProfileDropdown(false)}
                >
                  <div className="px-3 py-2 border-b border-zinc-800 font-semibold text-zinc-400">
                    Active Profile
                  </div>

                  <div className="px-3 py-2 flex items-center space-x-3 bg-zinc-800/40">
                    <img src={activeProfile.avatarUrl} className="w-7 h-7 rounded object-cover" />
                    <div className="flex-1 truncate">
                      <div className="font-bold text-white flex items-center space-x-1">
                        <span>{activeProfile.name}</span>
                        {activeProfile.isKids && (
                          <span className="bg-yellow-500 text-black text-[9px] font-bold px-1 rounded">KIDS</span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-500">{activeProfile.maturityRating}</div>
                    </div>
                  </div>

                  {/* Other Profiles Switcher */}
                  <div className="px-3 py-1.5 text-[11px] text-zinc-500 uppercase font-bold tracking-wider mt-1">
                    Switch Profile
                  </div>
                  {profiles.filter(p => p.id !== activeProfile.id).map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        dispatch(setActiveProfile(p));
                        setShowProfileDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-zinc-800 flex items-center space-x-2 transition-colors"
                    >
                      <img src={p.avatarUrl} className="w-5 h-5 rounded object-cover" />
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))}

                  <div className="border-t border-zinc-800 my-1" />

                  <button
                    onClick={() => {
                      dispatch(setEditingProfile(activeProfile));
                      setShowProfileDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-zinc-800 flex items-center space-x-2 text-zinc-300"
                  >
                    <Settings className="w-4 h-4 text-zinc-400" />
                    <span>Manage Profile Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      dispatch(setManaging(true));
                      dispatch(setActiveProfile(null));
                      setShowProfileDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-zinc-800 flex items-center space-x-2 text-zinc-300"
                  >
                    <User className="w-4 h-4 text-zinc-400" />
                    <span>Switch Profiles Screen</span>
                  </button>

                  <div className="border-t border-zinc-800 my-1" />

                  <button
                    onClick={() => {
                      dispatch(logout());
                      setShowProfileDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-zinc-800 flex items-center space-x-2 text-red-400 hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of FlixStream</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-1.5 rounded transition-colors shadow-lg shadow-red-900/30"
            >
              Sign In
            </button>
          )}

        </div>
      </div>
    </header>
  );
};

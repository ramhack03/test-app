import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../frontend/src/store';
import { useAppDispatch, useAppSelector } from '../frontend/src/hooks/redux';
import { checkAuth } from '../frontend/src/store/slices/authSlice';
import { fetchCatalog, fetchUserActivityData, setSelectedCategory, setSearchQuery, setSelectedMovie, setPlayingMovie } from '../frontend/src/store/slices/movieSlice';
import { syncProfiles } from '../frontend/src/store/slices/profileSlice';

import { Navbar } from '../frontend/src/components/Navbar';
import { HeroBanner } from '../frontend/src/components/HeroBanner';
import { MovieRow } from '../frontend/src/components/MovieRow';
import { MovieModal } from '../frontend/src/components/MovieModal';
import { VideoPlayerModal } from '../frontend/src/components/VideoPlayerModal';
import { ProfileSelector } from '../frontend/src/components/ProfileSelector';
import { ProfileSettingsModal } from '../frontend/src/components/ProfileSettingsModal';
import { WatchHistoryView } from '../frontend/src/components/WatchHistoryView';
import { MyListView } from '../frontend/src/components/MyListView';
import { AuthModal } from '../frontend/src/components/AuthModal';
import { RepoExplorer } from '../frontend/src/components/RepoExplorer';

function FlixStreamApp() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, profiles } = useAppSelector(state => state.auth);
  const { activeProfile, isManaging } = useAppSelector(state => state.profile);
  const { heroMovie, categories, selectedCategory, searchQuery, searchResults, selectedMovie, playingMovie } = useAppSelector(state => state.movie);

  const [activeTab, setActiveTab] = useState<'home' | 'tv' | 'movies' | 'new' | 'my-list' | 'history' | 'repo-explorer'>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check auth on boot
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Sync profiles
  useEffect(() => {
    if (profiles && profiles.length > 0) {
      dispatch(syncProfiles(profiles));
    }
  }, [profiles, dispatch]);

  // Load catalog based on active profile (Kids vs Adult)
  useEffect(() => {
    const isKids = activeProfile ? activeProfile.isKids : false;
    dispatch(fetchCatalog(isKids));
  }, [activeProfile, dispatch]);

  // Load user history & watchlist when active profile changes
  useEffect(() => {
    if (activeProfile && isAuthenticated) {
      dispatch(fetchUserActivityData());
    }
  }, [activeProfile, isAuthenticated, dispatch]);

  // Trigger search when query updates
  useEffect(() => {
    if (searchQuery) {
      const isKids = activeProfile ? activeProfile.isKids : false;
      dispatch(fetchCatalog(isKids));
    }
  }, [searchQuery, activeProfile, dispatch]);

  // If no profile is selected, show Netflix Profile Picker Screen
  if (!activeProfile || isManaging) {
    return (
      <div className="min-h-screen bg-[#050505] bg-radial-glow text-white font-sans selection:bg-red-600 selection:text-white pb-12">
        <ProfileSelector />
        <ProfileSettingsModal />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

        {/* Immersive UI Dev Status Bar Footer */}
        <footer className="dev-status-bar">
          <div className="dev-status-item">
            <span className="font-bold text-zinc-400">FRONTEND:</span>
            <span className="repo-tag">react-client-repo</span>
            <span className="status-indicator"></span>
            <span className="hidden sm:inline text-zinc-300">Redux State: SYNCED</span>
          </div>
          <div className="dev-status-item">
            <span className="font-bold text-zinc-400">BACKEND:</span>
            <span className="repo-tag">node-api-repo</span>
            <span className="status-indicator"></span>
            <span className="hidden sm:inline text-zinc-300">JWT AUTH: ACTIVE</span>
            <span className="text-zinc-500">DB: REST/Store</span>
          </div>
        </footer>
      </div>
    );
  }

  // Filter categories by selected Category Tab or Slug
  const displayedCategories = selectedCategory === 'all'
    ? categories
    : categories.filter(c => c.slug === selectedCategory);

  return (
    <div className="min-h-screen bg-[#050505] bg-radial-glow text-white font-sans selection:bg-red-600 selection:text-white pb-20">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Content Area based on Active Tab */}
      <main>
        {activeTab === 'history' ? (
          <WatchHistoryView />
        ) : activeTab === 'my-list' ? (
          <MyListView />
        ) : activeTab === 'repo-explorer' ? (
          <RepoExplorer />
        ) : (
          <div>
            {/* Search Results view or Hero + Rows */}
            {searchQuery.trim() ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-6">
                <h2 className="text-xl font-bold text-zinc-300">
                  Search Results for <span className="text-white font-black">"{searchQuery}"</span>
                </h2>
                {searchResults.length === 0 ? (
                  <div className="text-center py-16 text-zinc-500 text-sm">
                    No titles found matching your search. Try searching for "Cyber", "Odyssey", "Japan", or "Action".
                  </div>
                ) : (
                  <MovieRow title="Matching Titles" movies={searchResults} />
                )}
              </div>
            ) : (
              <div>
                {/* Hero Featured Movie Banner */}
                <HeroBanner movie={heroMovie} />

                {/* Movie Category Rows */}
                <div className="space-y-4 -mt-12 relative z-20">
                  {displayedCategories.map((cat) => (
                    <MovieRow key={cat.id} title={cat.name} movies={cat.movies || []} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <MovieModal movie={selectedMovie} onClose={() => dispatch(setSelectedMovie(null))} />
      <VideoPlayerModal movie={playingMovie} onClose={() => dispatch(setPlayingMovie(null))} />
      <ProfileSettingsModal />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Immersive UI Dev Status Bar Footer */}
      <footer className="dev-status-bar">
        <div className="dev-status-item">
          <span className="font-bold text-zinc-400">FRONTEND:</span>
          <span className="repo-tag">react-client-repo</span>
          <span className="status-indicator"></span>
          <span className="hidden sm:inline text-zinc-300">Redux State: SYNCED</span>
        </div>
        <div className="dev-status-item">
          <span className="font-bold text-zinc-400">BACKEND:</span>
          <span className="repo-tag">node-api-repo</span>
          <span className="status-indicator"></span>
          <span className="hidden sm:inline text-zinc-300">JWT AUTH: ACTIVE</span>
          <span className="text-zinc-500">DB: REST/Store</span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <FlixStreamApp />
    </Provider>
  );
}

import React from 'react';
import { X, Play, Plus, Check, ThumbsUp, ThumbsDown, Star, Sparkles, Clock, Film } from 'lucide-react';
import { Movie } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSelectedMovie, setPlayingMovie, toggleMyList, saveMovieRating } from '../store/slices/movieSlice';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const dispatch = useAppDispatch();
  const { watchlist, watchHistory, ratingsMap, categories } = useAppSelector(state => state.movie);

  if (!movie) return null;

  const inWatchlist = watchlist.some(w => w.movieId === movie.id);
  const historyItem = watchHistory.find(w => w.movieId === movie.id);
  const currentRating = ratingsMap[movie.id];

  // Find similar movies
  const similarMovies = categories
    .flatMap(c => c.movies || [])
    .filter((m, idx, self) => self.findIndex(t => t.id === m.id) === idx)
    .filter(m => m.id !== movie.id && m.categories.some(cat => movie.categories.includes(cat)))
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl text-white my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-full transition-colors border border-zinc-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image / Backdrop Header */}
        <div className="relative h-72 sm:h-96 w-full">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

          {/* Action Overlay */}
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white drop-shadow-lg font-sans">
              {movie.title}
            </h2>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  onClose();
                  dispatch(setPlayingMovie(movie));
                }}
                className="flex items-center space-x-2 bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-md font-bold text-sm shadow-xl transition-all"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>Play Movie</span>
              </button>

              <button
                onClick={() => dispatch(toggleMyList(movie.id))}
                className={`p-2.5 rounded-full border transition-colors ${inWatchlist ? 'bg-red-600/30 border-red-500 text-red-400' : 'bg-zinc-900/80 border-zinc-700 hover:border-white text-zinc-300'}`}
                title={inWatchlist ? 'Remove from My List' : 'Add to My List'}
              >
                {inWatchlist ? <Check className="w-5 h-5 text-red-400" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 space-y-6">
          
          {/* Metadata Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Overview & History */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-3 text-xs font-semibold">
                <span className="text-emerald-400 font-bold text-sm">{movie.matchScore}% Match</span>
                <span className="text-zinc-300">{movie.releaseYear}</span>
                <span className="border border-zinc-700 px-1.5 py-0.5 rounded text-[10px]">{movie.rating}</span>
                <span className="text-zinc-300">{movie.duration}</span>
                <span className="bg-red-600/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-mono">HD 4K</span>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {movie.description}
              </p>

              {/* Watch History Progress Card */}
              {historyItem && (
                <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center space-x-1.5 text-zinc-300">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span>Watch History Status</span>
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {historyItem.isCompleted ? 'Completed' : `${historyItem.completionPercentage}% Watched`}
                    </span>
                  </div>

                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full transition-all"
                      style={{ width: `${historyItem.completionPercentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Last watched: {new Date(historyItem.lastWatchedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* User Ratings Controls */}
              <div className="bg-zinc-950/60 p-4 rounded-lg border border-zinc-800 space-y-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Rate this title
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => dispatch(saveMovieRating({ movieId: movie.id, ratingType: 'thumbs_up' }))}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold transition-all ${currentRating?.ratingType === 'thumbs_up' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>I Like This</span>
                  </button>

                  <button
                    onClick={() => dispatch(saveMovieRating({ movieId: movie.id, ratingType: 'double_thumbs_up' }))}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold transition-all ${currentRating?.ratingType === 'double_thumbs_up' ? 'bg-red-600/30 border-red-500 text-red-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                  >
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <span>Love This!</span>
                  </button>

                  <button
                    onClick={() => dispatch(saveMovieRating({ movieId: movie.id, ratingType: 'thumbs_down' }))}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold transition-all ${currentRating?.ratingType === 'thumbs_down' ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>Not for me</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Cast, Director, Genres */}
            <div className="space-y-3 text-xs border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6 text-zinc-400">
              <div>
                <span className="text-zinc-500 block">Cast:</span>
                <span className="text-zinc-200">{movie.castMembers.join(', ')}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Director:</span>
                <span className="text-zinc-200">{movie.director}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Genres:</span>
                <span className="text-zinc-200 capitalize">{movie.categories.join(', ')}</span>
              </div>
            </div>

          </div>

          {/* Similar Movies Section */}
          {similarMovies.length > 0 && (
            <div className="space-y-3 border-t border-zinc-800 pt-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                More Like This
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similarMovies.map(sm => (
                  <div
                    key={sm.id}
                    onClick={() => dispatch(setSelectedMovie(sm))}
                    className="bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer group"
                  >
                    <div className="aspect-video w-full overflow-hidden relative">
                      <img src={sm.backdropUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-2.5 space-y-1">
                      <div className="font-bold text-xs text-white truncate">{sm.title}</div>
                      <div className="text-[10px] text-emerald-400">{sm.matchScore}% Match</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

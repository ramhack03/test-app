import React from 'react';
import { Bookmark, Play, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setPlayingMovie, setSelectedMovie, toggleMyList } from '../store/slices/movieSlice';

export const MyListView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { watchlist } = useAppSelector(state => state.movie);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-zinc-800 pb-4">
        <Bookmark className="w-8 h-8 text-red-600" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase">My List</h1>
          <p className="text-xs text-zinc-400">
            Saved movies and TV shows for quick streaming access
          </p>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800 space-y-3">
          <Bookmark className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-300">Your List is Empty</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Click the "+" icon on any title or trailer banner to save movies to your personal list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {watchlist.map((item) => {
            const movie = item.movie;
            if (!movie) return null;

            return (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all space-y-2 group relative"
              >
                <div 
                  onClick={() => dispatch(setSelectedMovie(movie))}
                  className="aspect-video w-full relative overflow-hidden cursor-pointer"
                >
                  <img
                    src={movie.backdropUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleMyList(movie.id));
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/80 text-red-400 hover:text-white rounded-full shadow border border-zinc-800"
                    title="Remove from My List"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 space-y-2">
                  <h3 className="font-bold text-xs text-white truncate">{movie.title}</h3>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-semibold">
                    <span className="text-emerald-400 font-bold">{movie.matchScore}% Match</span>
                    <span>{movie.duration}</span>
                  </div>

                  <button
                    onClick={() => dispatch(setPlayingMovie(movie))}
                    className="w-full mt-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 rounded transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Now</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

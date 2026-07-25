import React from 'react';
import { History, Play, Trash2, Clock, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setPlayingMovie, setSelectedMovie } from '../store/slices/movieSlice';

export const WatchHistoryView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { watchHistory } = useAppSelector(state => state.movie);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white space-y-6">
      
      {/* Title */}
      <div className="flex items-center space-x-3 border-b border-zinc-800 pb-4">
        <History className="w-8 h-8 text-red-600" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase">Watch History Tracking</h1>
          <p className="text-xs text-zinc-400">
            Real-time playback progress tracking saved to Express Node REST API
          </p>
        </div>
      </div>

      {watchHistory.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800 space-y-3">
          <History className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-zinc-300">No Watch History Yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Start streaming movies or trailers to automatically track your watch progress seconds and completion status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchHistory.map((item) => {
            const movie = item.movie;
            if (!movie) return null;

            return (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all space-y-3 group"
              >
                {/* Backdrop Thumbnail with Progress Overlay */}
                <div 
                  onClick={() => dispatch(setSelectedMovie(movie))}
                  className="aspect-video w-full relative overflow-hidden cursor-pointer"
                >
                  <img
                    src={movie.backdropUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                  {/* Play Button Overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setPlayingMovie(movie));
                    }}
                    className="absolute inset-0 m-auto w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl opacity-90 hover:scale-110 transition-transform"
                  >
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </button>

                  {/* Progress Bar Bottom Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-950">
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${item.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white truncate">{movie.title}</h3>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {item.isCompleted ? 'COMPLETED' : `${item.completionPercentage}%`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{item.progressSeconds}s / {item.durationSeconds || 120}s</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(item.lastWatchedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => dispatch(setPlayingMovie(movie))}
                    className="w-full mt-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Resume Playback</span>
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

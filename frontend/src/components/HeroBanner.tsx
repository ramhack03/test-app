import React, { useState } from 'react';
import { Play, Info, Volume2, VolumeX, Sparkles, Check, Plus } from 'lucide-react';
import { Movie } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSelectedMovie, setPlayingMovie, toggleMyList } from '../store/slices/movieSlice';

interface HeroBannerProps {
  movie: Movie | null;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movie }) => {
  const dispatch = useAppDispatch();
  const { watchlist } = useAppSelector(state => state.movie);
  const [isMuted, setIsMuted] = useState(true);

  if (!movie) {
    return (
      <div className="w-full h-[70vh] bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-700 font-mono">
        Loading Featured Stream...
      </div>
    );
  }

  const inWatchlist = watchlist.some(w => w.movieId === movie.id);

  return (
    <div className="relative w-full h-[75vh] min-h-[500px] text-white overflow-hidden select-none">
      
      {/* Background Image / Backdrop */}
      <div className="absolute inset-0">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.8]"
        />
        {/* Gradients to blend seamlessly into FlixStream dark theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30" />
      </div>

      {/* Hero Banner Details Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-24 z-10">
        <div className="max-w-2xl space-y-4">
          
          {/* Metadata Badges */}
          <div className="flex items-center space-x-3 text-xs font-semibold">
            {movie.isOriginal && (
              <span className="flex items-center space-x-1 text-red-500 font-bold uppercase tracking-widest text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FLIX ORIGINAL</span>
              </span>
            )}
            <span className="text-emerald-400 font-bold">{movie.matchScore}% Match</span>
            <span className="border border-zinc-600 px-1.5 py-0.5 rounded text-[10px] text-zinc-300 font-mono">{movie.rating}</span>
            <span className="text-zinc-300">{movie.duration}</span>
            <span className="text-zinc-400">{movie.releaseYear}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-lg uppercase font-sans">
            {movie.title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed drop-shadow">
            {movie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-2">
            <button
              onClick={() => dispatch(setPlayingMovie(movie))}
              className="flex items-center space-x-2 bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-md font-bold text-sm transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Play</span>
            </button>

            <button
              onClick={() => dispatch(setSelectedMovie(movie))}
              className="flex items-center space-x-2 bg-zinc-600/70 hover:bg-zinc-600/90 text-white px-5 py-2.5 rounded-md font-bold text-sm transition-all backdrop-blur-sm shadow-lg hover:scale-105 active:scale-95"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>

            <button
              onClick={() => dispatch(toggleMyList(movie.id))}
              className={`p-2.5 rounded-full border transition-colors ${inWatchlist ? 'bg-red-600/30 border-red-500 text-red-400' : 'bg-zinc-900/60 border-zinc-700 hover:border-white text-zinc-300'}`}
              title={inWatchlist ? 'Remove from My List' : 'Add to My List'}
            >
              {inWatchlist ? <Check className="w-5 h-5 text-red-400" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Audio Sound Toggle & Maturity Rating Tab on Bottom Right */}
      <div className="absolute right-6 bottom-24 flex items-center space-x-3 z-20">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-white rounded-full transition-all shadow-xl"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-red-500" />}
        </button>
        <div className="bg-zinc-900/80 border-l-4 border-red-600 px-3 py-1.5 text-xs font-bold text-zinc-200 uppercase font-mono">
          {movie.rating}
        </div>
      </div>

    </div>
  );
};

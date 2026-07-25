import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, ThumbsUp, ChevronDown, Sparkles } from 'lucide-react';
import { Movie } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSelectedMovie, setPlayingMovie, toggleMyList, saveMovieRating } from '../store/slices/movieSlice';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { watchlist, watchHistory, ratingsMap } = useAppSelector(state => state.movie);

  const [hoveredMovieId, setHoveredMovieId] = useState<string | null>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="space-y-2 py-4 px-4 sm:px-6 lg:px-8 group/row relative">
      <h2 className="text-lg sm:text-xl font-bold text-zinc-100 flex items-center space-x-2">
        <span>{title}</span>
        <ChevronRight className="w-4 h-4 text-zinc-500 opacity-0 group-hover/row:opacity-100 transition-opacity" />
      </h2>

      {/* Row Wrapper */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-0 bottom-0 z-30 w-10 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-r"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={rowRef}
          className="flex items-center space-x-3 overflow-x-auto scrollbar-none py-4 px-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => {
            const inWatchlist = watchlist.some(w => w.movieId === movie.id);
            const historyItem = watchHistory.find(w => w.movieId === movie.id);
            const userRating = ratingsMap[movie.id];

            return (
              <div
                key={movie.id}
                onMouseEnter={() => setHoveredMovieId(movie.id)}
                onMouseLeave={() => setHoveredMovieId(null)}
                className="relative flex-none w-44 sm:w-56 rounded-md overflow-hidden bg-zinc-900 group/card transition-all duration-300 hover:scale-105 hover:z-30 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-black"
              >
                {/* Poster / Backdrop Image */}
                <div 
                  onClick={() => dispatch(setSelectedMovie(movie))}
                  className="relative aspect-video w-full overflow-hidden"
                >
                  <img
                    src={movie.backdropUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover/card:brightness-110 transition-all"
                  />

                  {/* Netflix Original Badge */}
                  {movie.isOriginal && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow">
                      N ORIGINAL
                    </span>
                  )}

                  {/* Watch History Progress Bar */}
                  {historyItem && historyItem.completionPercentage > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                      <div
                        className="h-full bg-red-600"
                        style={{ width: `${historyItem.completionPercentage}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Card Hover Meta Layer */}
                <div className="p-3 space-y-2 bg-zinc-900 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => dispatch(setPlayingMovie(movie))}
                        className="p-2 bg-white hover:bg-zinc-200 text-black rounded-full transition-all"
                        title="Play Title"
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                      </button>

                      <button
                        onClick={() => dispatch(toggleMyList(movie.id))}
                        className={`p-2 rounded-full border text-xs transition-colors ${inWatchlist ? 'bg-red-600/20 border-red-500 text-red-400' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-white'}`}
                        title={inWatchlist ? 'Remove from My List' : 'Add to My List'}
                      >
                        {inWatchlist ? <Check className="w-3.5 h-3.5 text-red-400" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => dispatch(saveMovieRating({ movieId: movie.id, ratingType: 'thumbs_up' }))}
                        className={`p-2 rounded-full border text-xs transition-colors ${userRating?.ratingType === 'thumbs_up' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-white'}`}
                        title="Rate Thumbs Up"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(setSelectedMovie(movie))}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-full border border-zinc-700 transition-colors"
                      title="More details"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Metadata */}
                  <div>
                    <h3 className="font-bold text-xs text-white truncate">{movie.title}</h3>
                    <div className="flex items-center space-x-2 text-[10px] font-semibold text-zinc-400 mt-0.5">
                      <span className="text-emerald-400 font-bold">{movie.matchScore}% Match</span>
                      <span className="border border-zinc-700 px-1 rounded text-[9px]">{movie.rating}</span>
                      <span>{movie.duration}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-0 bottom-0 z-30 w-10 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-l"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw, CheckCircle } from 'lucide-react';
import { Movie } from '../types';
import { useAppDispatch } from '../hooks/redux';
import { updateWatchProgress } from '../store/slices/movieSlice';

interface VideoPlayerModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ movie, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useAppDispatch();

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Auto-hide controls overlay
  useEffect(() => {
    let timer: any;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  // Sync watch progress every 5 seconds to backend API
  useEffect(() => {
    if (!movie) return;
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        const cur = Math.floor(videoRef.current.currentTime);
        const dur = Math.floor(videoRef.current.duration || 120);
        dispatch(updateWatchProgress({ movieId: movie.id, progressSeconds: cur, durationSeconds: dur }));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [movie, dispatch]);

  if (!movie) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none">
      
      {/* HTML5 Video Engine */}
      <video
        ref={videoRef}
        src={movie.videoStreamUrl}
        autoPlay
        playsInline
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          dispatch(updateWatchProgress({ movieId: movie.id, progressSeconds: Math.floor(duration), durationSeconds: Math.floor(duration) }));
        }}
        onClick={togglePlay}
      />

      {/* Overlay UI Controls */}
      <div className={`absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/90 via-transparent to-black/80 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Top Bar: Back Button & Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              if (videoRef.current) {
                dispatch(updateWatchProgress({ movieId: movie.id, progressSeconds: Math.floor(videoRef.current.currentTime), durationSeconds: Math.floor(videoRef.current.duration || 120) }));
              }
              onClose();
            }}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
          <div>
            <h2 className="text-xl font-black text-white">{movie.title}</h2>
            <span className="text-xs text-zinc-400 font-mono">Stream: 1080p Full HD</span>
          </div>
        </div>

        {/* Center Big Play Pause Trigger */}
        <div className="self-center flex items-center space-x-8">
          <button
            onClick={() => skipTime(-10)}
            className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-transform active:scale-95"
          >
            <RotateCcw className="w-8 h-8" />
          </button>

          <button
            onClick={togglePlay}
            className="p-6 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-10 h-10 fill-white" /> : <Play className="w-10 h-10 fill-white" />}
          </button>

          <button
            onClick={() => skipTime(10)}
            className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-transform active:scale-95"
          >
            <RotateCw className="w-8 h-8" />
          </button>
        </div>

        {/* Bottom Bar: Timeline Slider & Volume */}
        <div className="space-y-3">
          
          {/* Progress Scrub Bar */}
          <div className="flex items-center space-x-3 text-xs font-mono text-zinc-300">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="text-white hover:text-red-500"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">
                DOLBY ATMOS
              </span>
              <button
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen();
                  }
                }}
                className="text-white hover:text-red-500"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

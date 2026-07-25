import React, { useState } from 'react';
import { X, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, registerUser, clearAuthError } from '../store/slices/authSlice';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [planTier, setPlanTier] = useState('Premium 4K HDR');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isRegister) {
      const res = await dispatch(registerUser({ email, password, planTier }));
      if (registerUser.fulfilled.match(res)) {
        onClose();
      }
    } else {
      const res = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(res)) {
        onClose();
      }
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@netflix.com');
    setPassword('password123');
    const res = await dispatch(loginUser({ email: 'demo@netflix.com', password: 'password123' }));
    if (loginUser.fulfilled.match(res)) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-white space-y-6 shadow-2xl">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <span className="text-red-600 font-black text-3xl tracking-tighter uppercase font-mono">
            FLIXSTREAM
          </span>
          <h2 className="text-xl font-bold text-white">
            {isRegister ? 'Create Your Account' : 'Sign In to Stream'}
          </h2>
          <p className="text-xs text-zinc-400">JWT-Secured Node.js REST API Backend</p>
        </div>

        {/* 1-Click Quick Demo Login Button */}
        <button
          onClick={handleDemoLogin}
          type="button"
          className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>1-Click Quick Demo Login</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-800 w-full" />
          <span className="absolute bg-zinc-950 px-3 text-[10px] text-zinc-500 uppercase font-mono">OR</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/60 border border-red-800 text-red-200 text-xs p-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => dispatch(clearAuthError())} className="text-red-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                required
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Select Streaming Plan Tier</label>
              <select
                value={planTier}
                onChange={(e) => setPlanTier(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
              >
                <option value="Basic 720p">Basic 720p - 1 Device ($9.99/mo)</option>
                <option value="Standard 1080p">Standard 1080p Full HD - 2 Devices ($15.49/mo)</option>
                <option value="Premium 4K HDR">Premium 4K Ultra HD + Spatial Audio - 4 Devices ($22.99/mo)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : isRegister ? 'Register & Stream' : 'Sign In'}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="text-center text-xs text-zinc-400">
          {isRegister ? (
            <span>Already have an account? <button onClick={() => setIsRegister(false)} className="text-white underline font-bold">Sign In</button></span>
          ) : (
            <span>New to FlixStream? <button onClick={() => setIsRegister(true)} className="text-white underline font-bold">Sign Up Now</button></span>
          )}
        </div>

      </div>
    </div>
  );
};

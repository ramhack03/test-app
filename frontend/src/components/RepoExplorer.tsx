import React, { useState } from 'react';
import { Code, Server, Layout, Copy, Check, FileText, Download, Terminal, Layers } from 'lucide-react';

export const RepoExplorer: React.FC = () => {
  const [activeRepo, setActiveRepo] = useState<'frontend' | 'backend'>('frontend');
  const [selectedFile, setSelectedFile] = useState<string>('frontend/src/store/slices/profileSlice.ts');
  const [copied, setCopied] = useState(false);

  const FRONTEND_FILES: Record<string, string> = {
    'frontend/package.json': `{
  "name": "flixstream-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.11.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "react-redux": "^9.2.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.4",
    "tailwindcss": "^4.1.14",
    "typescript": "~5.8.2",
    "vite": "^6.2.3"
  }
}`,
    'frontend/src/store/slices/profileSlice.ts': `import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '../../types';
import { api } from '../../services/api';

interface ProfileState {
  activeProfile: Profile | null;
  profiles: Profile[];
  isManaging: boolean;
  editingProfile: Profile | null;
}

const initialState: ProfileState = {
  activeProfile: null,
  profiles: [],
  isManaging: false,
  editingProfile: null,
};

export const updateProfileSettings = createAsyncThunk(
  'profile/updateSettings',
  async ({ profileId, updates }: { profileId: string; updates: Partial<Profile> }, { getState }) => {
    const state = getState() as any;
    const token = state.auth.token;
    return await api.updateProfile(token, profileId, updates);
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setActiveProfile(state, action: PayloadAction<Profile | null>) {
      state.activeProfile = action.payload;
    },
    setEditingProfile(state, action: PayloadAction<Profile | null>) {
      state.editingProfile = action.payload;
    }
  }
});

export const { setActiveProfile, setEditingProfile } = profileSlice.actions;
export default profileSlice.reducer;`,
    'frontend/src/services/api.ts': `import { User, Profile, Category, Movie } from '../types';

const API_BASE = '/api';

export const api = {
  async getCategories(isKids?: boolean): Promise<Category[]> {
    const res = await fetch(\`\${API_BASE}/movies/categories\${isKids ? '?isKids=true' : ''}\`);
    return (await res.json()).categories;
  },
  async getWatchHistory(token: string, profileId: string) {
    const res = await fetch(\`\${API_BASE}/activity/history?profileId=\${profileId}\`, {
      headers: { 'Authorization': \`Bearer \${token}\`, 'x-profile-id': profileId }
    });
    return (await res.json()).watchHistory;
  }
};`,
    'frontend/README.md': `# FlixStream Frontend (React + Redux Toolkit)

A Netflix clone frontend application built with React, Redux Toolkit, Tailwind CSS, and Lucide icons.

## Features
- Redux Toolkit state management for user profiles, movie catalog, watch history, and JWT auth
- Multi-profile support with Kids mode filter and maturity rating constraints
- Horizontal carousel rows with hover previews and video stream modal
- Watch history progress tracking in seconds

## Run Standalone
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\``
  };

  const BACKEND_FILES: Record<string, string> = {
    'backend/package.json': `{
  "name": "flixstream-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "tsx src/index.ts",
    "dev": "tsx watch src/index.ts"
  },
  "dependencies": {
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5"
  }
}`,
    'backend/src/db/schema.sql': `-- PostgreSQL / MySQL Schema
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    is_kids BOOLEAN DEFAULT FALSE,
    maturity_rating VARCHAR(10) DEFAULT 'NC-17'
);

CREATE TABLE watch_history (
    id VARCHAR(36) PRIMARY KEY,
    profile_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
    movie_id VARCHAR(36) NOT NULL,
    progress_seconds INT DEFAULT 0,
    duration_seconds INT DEFAULT 0,
    completion_percentage FLOAT DEFAULT 0.0,
    is_completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, movie_id)
);

CREATE TABLE ratings (
    id VARCHAR(36) PRIMARY KEY,
    profile_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
    movie_id VARCHAR(36) NOT NULL,
    rating_type VARCHAR(20) NOT NULL, -- 'thumbs_up', 'double_thumbs_up', 'thumbs_down'
    score INT CHECK (score >= 1 AND score <= 5)
);`,
    'backend/src/routes/activityRoutes.ts': `import { Router } from 'express';
import { getWatchHistory, updateWatchHistory, setRating } from '../controllers/userActivityController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

router.get('/history', getWatchHistory);
router.post('/history', updateWatchHistory);
router.post('/ratings', setRating);

export default router;`,
    'backend/README.md': `# FlixStream Backend REST API

Node.js + Express REST API backend with JWT authentication, multi-profile database endpoints, and watch history tracking.

## DB Schema
Supports PostgreSQL, MySQL, and SQLite. DDL script located at \`backend/src/db/schema.sql\`.

## Run Standalone
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\``
  };

  const currentFiles = activeRepo === 'frontend' ? FRONTEND_FILES : BACKEND_FILES;

  const handleCopyCode = () => {
    const code = currentFiles[selectedFile] || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Layers className="w-6 h-6 text-red-600" />
            <h1 className="text-2xl font-black uppercase tracking-tight">
              Dual Repository Code Inspector
            </h1>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl">
            This application is structured into two completely standalone codebase repositories: <strong className="text-white">/frontend</strong> (React + Redux Toolkit) and <strong className="text-white">/backend</strong> (Node.js + Express REST API). You can inspect, copy, or export either repository independently.
          </p>
        </div>

        {/* Repository Switcher Tabs */}
        <div className="flex items-center space-x-2 bg-black/60 p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => {
              setActiveRepo('frontend');
              setSelectedFile('frontend/src/store/slices/profileSlice.ts');
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeRepo === 'frontend' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            <Layout className="w-4 h-4" />
            <span>Frontend Repository</span>
          </button>

          <button
            onClick={() => {
              setActiveRepo('backend');
              setSelectedFile('backend/src/db/schema.sql');
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeRepo === 'backend' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            <Server className="w-4 h-4" />
            <span>Backend Repository</span>
          </button>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Left Sidebar File Tree */}
        <div className="p-4 bg-zinc-900/60 border-r border-zinc-800 space-y-3">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>{activeRepo === 'frontend' ? 'Frontend Codebase' : 'Backend Codebase'}</span>
            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300 font-mono">
              {Object.keys(currentFiles).length} files
            </span>
          </div>

          <div className="space-y-1">
            {Object.keys(currentFiles).map((path) => (
              <button
                key={path}
                onClick={() => setSelectedFile(path)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors flex items-center space-x-2 ${selectedFile === path ? 'bg-red-600/20 text-red-400 font-bold border border-red-500/40' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate">{path}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-500 space-y-2">
            <div className="font-bold text-zinc-400">Export as Separate Git Repo:</div>
            <p>
              To export <code className="text-red-400">/{activeRepo}</code> to a standalone Github repository, copy the directory files into your fresh workspace and run <code className="text-white">npm install</code>.
            </p>
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="md:col-span-3 p-6 space-y-4 bg-zinc-950 flex flex-col">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center space-x-2 font-mono text-xs text-red-400 font-bold">
              <Code className="w-4 h-4 text-zinc-500" />
              <span>{selectedFile}</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs px-3 py-1.5 rounded-lg text-zinc-200 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              <span>{copied ? 'Copied Code!' : 'Copy File Content'}</span>
            </button>
          </div>

          {/* Syntax Highlight Box */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-zinc-200 leading-relaxed max-h-[500px]">
            <pre>{currentFiles[selectedFile] || '// Select a file from the tree to view content'}</pre>
          </div>

        </div>

      </div>

    </div>
  );
};

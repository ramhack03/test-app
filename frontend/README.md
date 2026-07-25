# FlixStream Frontend - React + Redux Toolkit SPA

React single-page application for the FlixStream Netflix clone, powered by Redux Toolkit state management, Tailwind CSS, and Lucide icons.

## 🚀 Key Features

- **Redux Toolkit Architecture**:
  - `authSlice.ts`: Manages JWT tokens, authenticated state, and login/register thunks.
  - `profileSlice.ts`: Manages account profiles, Kids mode filter, maturity ratings, autoplay preferences, and active profile context.
  - `movieSlice.ts`: Manages categories, hero featured banner, watch history tracking, movie ratings (thumbs/stars), and My List (watchlist).
- **Responsive Netflix Dark UI**:
  - Hero banner with video trailer preview and match percentage scores
  - Horizontal carousels with smooth scroll controls and hover cards
  - Full-screen HTML5 video player with real-time watch progress reporting to the Node.js REST API
  - Dual Repository Explorer for developers to inspect frontend & backend codebases side-by-side

## ⚡ Quick Start

```bash
cd frontend
npm install
npm run dev
```

App will run at `http://localhost:5173`.

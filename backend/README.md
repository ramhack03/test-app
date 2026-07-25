# FlixStream Backend - RESTful API

Node.js + Express RESTful API backend service for the FlixStream Netflix clone application.

## 🚀 Key Features

- **JWT Authentication**: Register, Login, and Protected JWT Token middleware (`/api/auth`)
- **Multi-Profile Management**: Account profiles with Kids Mode, maturity ratings, and playback preferences (`/api/profiles`)
- **Streaming Movie Metadata**: Categories, Hero featured titles, search filter, video stream URLs (`/api/movies`)
- **User Activity Tracking**:
  - Movie Ratings (Thumbs Up / Double Thumbs Up / Thumbs Down / 1-5 Star score)
  - Watch History with video progress timestamp seconds and completion status
  - Watchlist / My List saved items

## 📁 Repository Structure

```
backend/
├── src/
│   ├── config/
│   │   └── jwt.ts               # JWT secrets & token expiration config
│   ├── controllers/
│   │   ├── authController.ts    # Login & Register handlers
│   │   ├── profileController.ts # Profile CRUD handlers
│   │   ├── movieController.ts   # Metadata & Category handlers
│   │   └── userActivityController.ts # Ratings, Watch History & Watchlist
│   ├── db/
│   │   ├── schema.sql           # Production PostgreSQL/MySQL DDL Schema
│   │   └── db.ts                # Active JSON/SQLite data engine
│   ├── middleware/
│   │   └── auth.ts              # JWT verify middleware
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── profileRoutes.ts
│   │   ├── movieRoutes.ts
│   │   └── activityRoutes.ts
│   ├── app.ts                   # Express server definition
│   └── index.ts                 # Server entrypoint
├── data/                        # Persistent local data storage
├── package.json
└── README.md
```

## 🛠️ Environment Variables

Copy `.env.example` to `.env`:
```env
PORT=3000
JWT_SECRET=super-secret-netflix-jwt-key-2026
```

## ⚡ Quick Start

```bash
cd backend
npm install
npm run dev
```

The REST API will be running at `http://localhost:3000/api`.

### Test Endpoints
- `GET /api/health` - Check API status
- `POST /api/auth/login` - Login (`email: demo@netflix.com`, `password: password123`)
- `GET /api/movies/categories` - Get all movie rows with categories
- `GET /api/movies/hero` - Get featured banner movie

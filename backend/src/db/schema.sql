-- =========================================================
-- NETFLIX CLONE DATABASE SCHEMA (PostgreSQL / MySQL / SQLite)
-- Supports Users, Multi-Profile Management, Movie Metadata,
-- Categories, Ratings, Watch History Tracking, and Watchlist.
-- =========================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    plan_tier VARCHAR(50) DEFAULT 'Standard 1080p', -- Basic, Standard, Premium
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROFILES TABLE (Multi-profile per account)
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500) NOT NULL,
    is_kids BOOLEAN DEFAULT FALSE,
    maturity_rating VARCHAR(10) DEFAULT 'NC-17', -- G, PG, PG-13, TV-MA, NC-17
    autoplay_next_episode BOOLEAN DEFAULT TRUE,
    autoplay_previews BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    display_order INT DEFAULT 0
);

-- 4. MOVIES / TV SHOWS METADATA TABLE
CREATE TABLE IF NOT EXISTS movies (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    release_year INT NOT NULL,
    rating VARCHAR(10) NOT NULL, -- TV-MA, PG-13, TV-14, etc.
    duration VARCHAR(50) NOT NULL, -- e.g., '2h 15m' or '3 Seasons'
    match_score INT DEFAULT 95, -- Netflix match percentage e.g. 98%
    poster_url VARCHAR(500) NOT NULL,
    backdrop_url VARCHAR(500) NOT NULL,
    trailer_url VARCHAR(500) NOT NULL,
    video_stream_url VARCHAR(500) NOT NULL,
    cast_members TEXT, -- Comma separated or JSON array
    director VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    is_original BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. MOVIE_CATEGORIES (Many-to-Many Join Table)
CREATE TABLE IF NOT EXISTS movie_categories (
    movie_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (movie_id, category_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 6. RATINGS TABLE (Supports Thumbs & 1-5 Star Ratings)
CREATE TABLE IF NOT EXISTS ratings (
    id VARCHAR(36) PRIMARY KEY,
    profile_id VARCHAR(36) NOT NULL,
    movie_id VARCHAR(36) NOT NULL,
    rating_type VARCHAR(20) NOT NULL, -- 'thumbs_up', 'double_thumbs_up', 'thumbs_down', 'stars'
    score INT CHECK (score >= 1 AND score <= 5), -- optional numeric star rating
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, movie_id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- 7. WATCH HISTORY TRACKING TABLE (Track playback position & completion)
CREATE TABLE IF NOT EXISTS watch_history (
    id VARCHAR(36) PRIMARY KEY,
    profile_id VARCHAR(36) NOT NULL,
    movie_id VARCHAR(36) NOT NULL,
    progress_seconds INT DEFAULT 0, -- Current timestamp in video
    duration_seconds INT DEFAULT 0, -- Total video duration
    completion_percentage FLOAT DEFAULT 0.0,
    is_completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, movie_id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- 8. WATCHLIST / MY LIST TABLE
CREATE TABLE IF NOT EXISTS watchlist (
    id VARCHAR(36) PRIMARY KEY,
    profile_id VARCHAR(36) NOT NULL,
    movie_id VARCHAR(36) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, movie_id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_profile ON watch_history(profile_id);
CREATE INDEX IF NOT EXISTS idx_ratings_profile ON ratings(profile_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_profile ON watchlist(profile_id);

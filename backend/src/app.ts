import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/activity', activityRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FlixStream Node.js REST API', version: '1.0.0' });
});

export default app;

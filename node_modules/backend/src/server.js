const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/game');
const adminRoutes = require('./routes/admin');
const resultsRoutes = require('./routes/results');
const leaderboardRoutes = require('./routes/leaderboard');
const quizRoutes = require('./routes/quiz');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
console.log('Teams route registered at /api/teams');
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/quiz', quizRoutes);
console.log('Quiz route registered at /api/quiz');
app.use('/api/settings', settingsRoutes);
console.log('Settings route registered at /api/settings');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- /api/teams (GET, POST, PUT, DELETE)');
    console.log('- /api/quiz (GET, POST)');
    console.log('- /api/quiz/create (POST)');
    console.log('- /api/settings (GET, POST)');
  });
}

module.exports = app;
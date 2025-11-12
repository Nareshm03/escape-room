const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const connectDB = require('./utils/mongodb');

const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/game');
const adminRoutes = require('./routes/admin');
const resultsRoutes = require('./routes/results');
const leaderboardRoutes = require('./routes/leaderboard');
const quizRoutes = require('./routes/quiz');
const settingsRoutes = require('./routes/settings');
const systemRoutes = require('./routes/system');
const eventRoutes = require('./routes/event');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(compression());
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
app.use('/quiz', quizRoutes);
console.log('Quiz public routes registered at /quiz');
app.use('/api/settings', settingsRoutes);
console.log('Settings route registered at /api/settings');
app.use('/api/system', systemRoutes);
console.log('System route registered at /api/system');
app.use('/api/event', eventRoutes);
console.log('Event route registered at /api/event');

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
  // Connect to MongoDB first
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Available routes:');
      console.log('- /api/teams (GET, POST, PUT, DELETE)');
      console.log('- /api/quiz (GET, POST)');
      console.log('- /api/quiz/create (POST)');
      console.log('- /api/settings (GET, POST)');
    });
  }).catch(error => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });
}

module.exports = app;
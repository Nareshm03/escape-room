const express = require('express');
const { EventStatus } = require('../models');
const connectDB = require('../utils/mongodb');

const router = express.Router();

// Simple admin check (replace with proper auth middleware in production)
const requireAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'dev-admin-key') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Start event
router.post('/start', requireAdmin, async (req, res) => {
  const { gameId } = req.body;
  
  if (!gameId) {
    return res.status(400).json({ error: 'Game ID is required' });
  }

  try {
    await connectDB();
    
    const game = await EventStatus.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (game.isActive && !game.isCompleted) {
      return res.status(400).json({ error: 'Game is already active' });
    }

    game.isActive = true;
    game.isCompleted = false;
    game.startTime = new Date();
    await game.save();

    console.log(`[ADMIN] Game ${gameId} started at ${game.startTime}`);
    res.json({ message: 'Game started successfully', game });
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Failed to start game: ' + error.message });
  }
});

// Pause event
router.post('/pause', requireAdmin, async (req, res) => {
  const { gameId } = req.body;
  
  if (!gameId) {
    return res.status(400).json({ error: 'Game ID is required' });
  }

  try {
    await connectDB();
    
    const game = await EventStatus.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (!game.isActive) {
      return res.status(400).json({ error: 'Game is not active' });
    }

    game.isActive = false;
    await game.save();

    console.log(`[ADMIN] Game ${gameId} paused`);
    res.json({ message: 'Game paused successfully', game });
  } catch (error) {
    console.error('Error pausing game:', error);
    res.status(500).json({ error: 'Failed to pause game: ' + error.message });
  }
});

// Reset event
router.post('/reset', requireAdmin, async (req, res) => {
  const { gameId } = req.body;
  
  if (!gameId) {
    return res.status(400).json({ error: 'Game ID is required' });
  }

  try {
    await connectDB();
    
    const game = await EventStatus.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    game.isActive = false;
    game.isCompleted = false;
    game.startTime = null;
    game.endTime = null;
    game.winnerTeam = null;
    await game.save();

    console.log(`[ADMIN] Game ${gameId} reset`);
    res.json({ message: 'Game reset successfully', game });
  } catch (error) {
    console.error('Error resetting game:', error);
    res.status(500).json({ error: 'Failed to reset game: ' + error.message });
  }
});

// Get event status
router.get('/status/:gameId', async (req, res) => {
  try {
    await connectDB();
    const game = await EventStatus.findById(req.params.gameId);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    console.error('Error fetching game status:', error);
    res.status(500).json({ error: 'Failed to fetch game status: ' + error.message });
  }
});

module.exports = router;

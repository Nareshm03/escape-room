const express = require('express');
const db = require('../utils/db');

const router = express.Router();

// Get all teams
router.get('/teams', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM teams ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get teams' });
  }
});













module.exports = router;
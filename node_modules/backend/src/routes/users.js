const express = require('express');
const db = require('../utils/db');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, email, name FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
});

module.exports = router;
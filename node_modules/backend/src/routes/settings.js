const express = require('express');
const db = require('../utils/db');
const router = express.Router();

// Get settings
router.get('/', async (req, res) => {
  try {
    // Create table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS quiz_settings (
        id SERIAL PRIMARY KEY,
        settings JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const result = await db.query('SELECT * FROM quiz_settings LIMIT 1');
    if (result.rows.length > 0) {
      res.json(result.rows[0].settings);
    } else {
      res.json({});
    }
  } catch (error) {
    console.error('Settings get error:', error);
    res.status(500).json({ error: 'Failed to get settings: ' + error.message });
  }
});

// Save settings
router.post('/', async (req, res) => {
  console.log('Settings POST route hit with data:', req.body);
  try {
    const settings = req.body;
    
    // Create table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS quiz_settings (
        id SERIAL PRIMARY KEY,
        settings JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check if settings exist
    const existing = await db.query('SELECT id FROM quiz_settings LIMIT 1');
    
    if (existing.rows.length > 0) {
      // Update existing settings
      await db.query(
        'UPDATE quiz_settings SET settings = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [JSON.stringify(settings), existing.rows[0].id]
      );
    } else {
      // Create new settings
      await db.query(
        'INSERT INTO quiz_settings (settings) VALUES ($1)',
        [JSON.stringify(settings)]
      );
    }
    
    console.log('Settings saved successfully');
    res.json({ message: 'Settings saved successfully', settings });
  } catch (error) {
    console.error('Settings save error:', error);
    res.status(500).json({ error: 'Failed to save settings: ' + error.message });
  }
});

module.exports = router;
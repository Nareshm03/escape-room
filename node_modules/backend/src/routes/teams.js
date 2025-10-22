const express = require('express');
const db = require('../utils/db');

const router = express.Router();

// Get all teams with member info
router.get('/', async (req, res) => {
  try {
    // Create tables if they don't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(team_id, user_id)
      )
    `);
    
    const result = await db.query(`
      SELECT 
        t.*,
        COALESCE(u.name, 'System') as created_by_name,
        COUNT(tm.user_id) as member_count
      FROM teams t
      LEFT JOIN users u ON t.created_by = u.id
      LEFT JOIN team_members tm ON t.id = tm.team_id
      GROUP BY t.id, u.name
      ORDER BY t.created_at DESC
    `);
    console.log('Teams query result:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Teams fetch error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Failed to get teams: ' + error.message });
  }
});

// Create team
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO teams (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, description || '', 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Update team
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await db.query(
      'UPDATE teams SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, description, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// Delete team
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM teams WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

module.exports = router;
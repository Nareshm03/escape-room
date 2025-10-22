const express = require('express');
const db = require('../utils/db');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password, name, teamName } = req.body;

  try {
    // Create user
    const userResult = await db.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, password, name]
    );
    const user = userResult.rows[0];

    // Create team
    const teamResult = await db.query(
      'INSERT INTO teams (name, created_by) VALUES ($1, $2) RETURNING *',
      [teamName, user.id]
    );
    const team = teamResult.rows[0];
    
    // Add user to team
    await db.query(
      'INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)',
      [team.id, user.id, 'admin']
    );

    res.status(201).json({ user, team });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt:', { email, password: password ? '[HIDDEN]' : 'undefined' });
    const result = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    console.log('Query result:', result.rows.length, 'users found');
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

module.exports = router;
const express = require('express');
const db = require('../utils/db');

const router = express.Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        qs.team_name,
        qs.score,
        qs.submitted_at,
        q.title as quiz_title,
        (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as total_questions,
        CAST(ROUND(CAST((qs.score::float / NULLIF((SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id), 0)) * 100 AS numeric), 2) AS float) as percentage
      FROM quiz_submissions qs
      JOIN quizzes q ON qs.quiz_id = q.id
      ORDER BY qs.score DESC, qs.submitted_at ASC
      LIMIT 10
    `);
    console.log('Leaderboard query result:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

module.exports = router;
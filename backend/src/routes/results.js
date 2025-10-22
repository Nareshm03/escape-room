const express = require('express');
const db = require('../utils/db');

const router = express.Router();

// Get quiz results
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        qs.team_name,
        qs.score,
        qs.submitted_at,
        q.title as quiz_title,
        (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) as total_questions
      FROM quiz_submissions qs
      JOIN quizzes q ON qs.quiz_id = q.id
      ORDER BY qs.score DESC, qs.submitted_at ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get results' });
  }
});







module.exports = router;
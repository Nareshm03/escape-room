const express = require('express');
const db = require('../utils/db');

const router = express.Router();

// Get game stages
router.get('/stages', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM game_stages ORDER BY stage_number');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stages' });
  }
});

// Submit answer
router.post('/submit', async (req, res) => {
  const { stageId, answer } = req.body;
  try {
    const stageResult = await db.query('SELECT * FROM game_stages WHERE id = $1', [stageId]);
    if (stageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Stage not found' });
    }
    
    const stage = stageResult.rows[0];
    const isCorrect = answer.toLowerCase().trim() === stage.correct_answer.toLowerCase();
    
    res.json({ correct: isCorrect, message: isCorrect ? 'Correct!' : 'Try again!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});



module.exports = router;
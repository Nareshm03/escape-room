const express = require('express');
const db = require('../utils/db');
const router = express.Router();

// Create quiz (admin)
router.post('/create', async (req, res) => {
  const { title, description, questions, totalTimeMinutes } = req.body;
  const quizLink = Math.random().toString(36).substring(2, 15);
  
  console.log('Creating quiz:', { title, description, questionsCount: questions?.length, totalTimeMinutes });
  
  try {
    // Create tables if they don't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        quiz_link VARCHAR(255) UNIQUE NOT NULL,
        is_published BOOLEAN DEFAULT FALSE,
        total_time_minutes INTEGER DEFAULT 30,
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id SERIAL PRIMARY KEY,
        quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        question_order INTEGER NOT NULL,
        time_limit_seconds INTEGER DEFAULT 120
      )
    `);
    const quizResult = await db.query(
      'INSERT INTO quizzes (title, description, quiz_link, total_time_minutes, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, quizLink, totalTimeMinutes || 30, 1]
    );
    
    const quiz = quizResult.rows[0];
    
    for (let i = 0; i < questions.length; i++) {
      await db.query(
        'INSERT INTO quiz_questions (quiz_id, question_text, correct_answer, question_order, time_limit_seconds) VALUES ($1, $2, $3, $4, $5)',
        [quiz.id, questions[i].question, questions[i].answer, i + 1, questions[i].timeLimit || 120]
      );
    }
    
    console.log('Quiz created successfully:', quiz.id);
    res.json({ quiz, link: `/quiz/${quizLink}` });
  } catch (error) {
    console.error('Quiz creation error:', error);
    res.status(500).json({ error: 'Failed to create quiz: ' + error.message });
  }
});

// Publish quiz
router.post('/:id/publish', async (req, res) => {
  try {
    await db.query('UPDATE quizzes SET is_published = TRUE WHERE id = $1', [req.params.id]);
    res.json({ message: 'Quiz published' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to publish quiz' });
  }
});

// Get quiz by link (public)
router.get('/:link', async (req, res) => {
  try {
    const quizResult = await db.query(
      'SELECT * FROM quizzes WHERE quiz_link = $1 AND is_published = TRUE',
      [req.params.link]
    );
    
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    const questionsResult = await db.query(
      'SELECT question_text, question_order, time_limit_seconds FROM quiz_questions WHERE quiz_id = $1 ORDER BY question_order',
      [quizResult.rows[0].id]
    );
    
    res.json({
      quiz: quizResult.rows[0],
      questions: questionsResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get quiz' });
  }
});

// Check single answer
router.post('/:link/check', async (req, res) => {
  const { questionIndex, answer } = req.body;
  
  try {
    const quizResult = await db.query(
      'SELECT * FROM quizzes WHERE quiz_link = $1 AND is_published = TRUE',
      [req.params.link]
    );
    
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    const quiz = quizResult.rows[0];
    const questionResult = await db.query(
      'SELECT correct_answer FROM quiz_questions WHERE quiz_id = $1 AND question_order = $2',
      [quiz.id, questionIndex + 1]
    );
    
    if (questionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const isCorrect = answer.toLowerCase().trim() === questionResult.rows[0].correct_answer.toLowerCase().trim();
    res.json({ correct: isCorrect });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check answer' });
  }
});

// Submit quiz answers (public)
router.post('/:link/submit', async (req, res) => {
  const { teamName, answers } = req.body;
  
  try {
    const quizResult = await db.query(
      'SELECT * FROM quizzes WHERE quiz_link = $1 AND is_published = TRUE',
      [req.params.link]
    );
    
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    const quiz = quizResult.rows[0];
    const correctAnswers = await db.query(
      'SELECT correct_answer FROM quiz_questions WHERE quiz_id = $1 ORDER BY question_order',
      [quiz.id]
    );
    
    let score = 0;
    correctAnswers.rows.forEach((correct, index) => {
      if (answers[index] && answers[index].toLowerCase().trim() === correct.correct_answer.toLowerCase().trim()) {
        score++;
      }
    });
    
    // Create team if it doesn't exist
    const existingTeam = await db.query(
      'SELECT id FROM teams WHERE name = $1',
      [teamName]
    );
    
    if (existingTeam.rows.length === 0) {
      await db.query(
        'INSERT INTO teams (name, description, created_by) VALUES ($1, $2, $3)',
        [teamName, `Team created from quiz: ${quiz.title}`, 1]
      );
    }
    
    await db.query(
      'INSERT INTO quiz_submissions (quiz_id, team_name, answers, score) VALUES ($1, $2, $3, $4)',
      [quiz.id, teamName, answers, score]
    );
    
    res.json({ score, total: correctAnswers.rows.length });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get all quizzes (admin)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM quizzes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get quizzes' });
  }
});

// Get quiz results (admin)
router.get('/:id/results', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT team_name, score, submitted_at FROM quiz_submissions WHERE quiz_id = $1 ORDER BY score DESC, submitted_at ASC',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get quiz results' });
  }
});

module.exports = router;
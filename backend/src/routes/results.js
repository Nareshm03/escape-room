const express = require('express');
const { QuizSubmission, Quiz } = require('../models');

const router = express.Router();

// Get quiz results
router.get('/', async (req, res) => {
  try {
    const submissions = await QuizSubmission.find()
      .populate('quiz', 'title')
      .sort({ score: -1, submittedAt: 1 })
      .lean();

    const results = submissions.map(submission => ({
      team_name: submission.teamName,
      score: submission.score,
      submitted_at: submission.submittedAt,
      quiz_title: submission.quiz?.title,
      total_questions: submission.answers?.length || 0
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get results: ' + error.message });
  }
});

// Clear all quiz submissions (admin only)
router.delete('/clear-all', async (req, res) => {
  try {
    const result = await QuizSubmission.deleteMany({});
    console.log('Cleared all quiz submissions:', result.deletedCount);
    res.json({ message: 'All quiz submissions cleared', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear submissions: ' + error.message });
  }
});







module.exports = router;
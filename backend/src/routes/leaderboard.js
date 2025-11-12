const express = require('express');
const { QuizSubmission, Quiz } = require('../models');

const router = express.Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const submissions = await QuizSubmission.find()
      .populate('quiz', 'title')
      .sort({ percentage: -1, score: -1, submittedAt: 1 })
      .lean();

    const leaderboard = submissions.map(submission => {
      const totalQuestions = submission.answers?.length || 0;
      const correctAnswers = submission.answers?.filter(a => a.isCorrect).length || 0;
      const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      
      return {
        team_name: submission.teamName,
        score: correctAnswers,
        submitted_at: submission.submittedAt,
        quiz_title: submission.quiz?.title || 'Unknown Quiz',
        total_questions: totalQuestions,
        percentage: percentage,
        completion_time: submission.totalTimeSpent || 0,
        hints_used: 0
      };
    });

    console.log('Leaderboard query result:', leaderboard.length, 'submissions');
    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard: ' + error.message });
  }
});

module.exports = router;
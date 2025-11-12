const express = require('express');
const { Quiz, QuizSubmission, Team, User } = require('../models');

const router = express.Router();

// Create quiz (admin)
router.post('/create', async (req, res) => {
  const { title, description, questions, totalTimeMinutes, isPublished } = req.body;
  const quizLink = Math.random().toString(36).substring(2, 15);

  console.log('Creating quiz:', { title, description, questionsCount: questions?.length, totalTimeMinutes, isPublished });

  try {
    const quiz = new Quiz({
      title,
      description,
      quizLink,
      totalTimeMinutes: totalTimeMinutes || 30,
      isPublished: isPublished || false,
      createdBy: null,
      questions: questions.map((q, index) => ({
        questionText: q.question,
        correctAnswer: q.answer,
        questionOrder: index + 1,
        timeLimitSeconds: q.timeLimit || 120
      }))
    });

    await quiz.save();

    console.log('Quiz created successfully:', quiz._id, 'Published:', quiz.isPublished);
    res.status(201).json({ quiz, link: `/quiz/${quizLink}` });
  } catch (error) {
    console.error('Quiz creation error:', error);
    res.status(500).json({ error: 'Failed to create quiz: ' + error.message });
  }
});

// Publish quiz
router.post('/:id/publish', async (req, res) => {
  try {
    console.log('Publishing quiz with ID:', req.params.id);
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true }
    );

    if (!quiz) {
      console.error('Quiz not found for publishing:', req.params.id);
      return res.status(404).json({ error: 'Quiz not found' });
    }

    console.log('Quiz published successfully:', quiz._id, 'Link:', quiz.quizLink);
    res.json({ message: 'Quiz published', quizLink: quiz.quizLink });
  } catch (error) {
    console.error('Failed to publish quiz:', error);
    res.status(500).json({ error: 'Failed to publish quiz: ' + error.message });
  }
});

// Get quiz by link (public)
router.get('/:link', async (req, res) => {
  try {
    console.log('Fetching quiz by link:', req.params.link);
    const quiz = await Quiz.findOne({
      quizLink: req.params.link,
      isPublished: true
    });

    if (!quiz) {
      console.error('Quiz not found or not published:', req.params.link);
      return res.status(404).json({ error: 'Quiz not found or not published' });
    }

    console.log('Quiz found and accessible:', quiz._id);

    // Return only necessary fields for public access
    const publicQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      totalTimeMinutes: quiz.totalTimeMinutes,
      sequential_unlock_enabled: quiz.sequential_unlock_enabled,
      questions: quiz.questions.map(q => ({
        questionText: q.questionText,
        questionOrder: q.questionOrder,
        timeLimitSeconds: q.timeLimitSeconds
      }))
    };

    res.json({ quiz: publicQuiz });
  } catch (error) {
    console.error('Failed to get quiz:', error);
    res.status(500).json({ error: 'Failed to get quiz: ' + error.message });
  }
});

// Check single answer
router.post('/:link/check', async (req, res) => {
  const { questionIndex, answer, unlockedQuestions } = req.body;

  try {
    console.log('Checking answer for quiz link:', req.params.link, 'question:', questionIndex);
    const quiz = await Quiz.findOne({
      quizLink: req.params.link,
      isPublished: true
    });

    if (!quiz) {
      console.error('Quiz not found for answer check:', req.params.link);
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Validate sequential unlock if enabled
    if (quiz.sequential_unlock_enabled && unlockedQuestions) {
      if (!unlockedQuestions.includes(questionIndex)) {
        console.error('Sequence violation: Question', questionIndex, 'is locked');
        return res.status(403).json({ error: 'Question is locked. Complete previous questions first.' });
      }
    }

    const question = quiz.questions.find(q => q.questionOrder === questionIndex + 1);

    if (!question) {
      console.error('Question not found:', questionIndex + 1, 'in quiz:', req.params.link);
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
    console.log('Answer check result:', isCorrect ? 'correct' : 'incorrect');
    res.json({ correct: isCorrect });
  } catch (error) {
    console.error('Failed to check answer:', error);
    res.status(500).json({ error: 'Failed to check answer: ' + error.message });
  }
});

// Submit quiz answers (public)
router.post('/:link/submit', async (req, res) => {
  const { teamName, answers, startTime } = req.body;

  try {
    console.log('Submitting quiz answers for link:', req.params.link, 'team:', teamName);
    const quiz = await Quiz.findOne({
      quizLink: req.params.link,
      isPublished: true
    });

    if (!quiz) {
      console.error('Quiz not found for submission:', req.params.link);
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let score = 0;
    const processedAnswers = answers.map((answer, index) => {
      const question = quiz.questions.find(q => q.questionOrder === index + 1);
      const isCorrect = question &&
        answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

      if (isCorrect) score++;

      return {
        questionOrder: index + 1,
        answer,
        isCorrect,
        timeSpent: 0 // Default time spent, could be enhanced later
      };
    });

    // Create team if it doesn't exist (skip team creation for now to avoid validation issues)
    let team = await Team.findOne({ name: teamName });
    if (!team) {
      console.log('Team not found, proceeding without team creation for quiz submission');
    }

    // Create quiz submission using standardized schema
    const submission = new QuizSubmission({
      quiz: quiz._id,
      teamName,
      answers: processedAnswers,
      score,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: new Date()
    });

    await submission.save();
    console.log('Quiz submission saved successfully:', submission._id, 'Score:', score);

    res.json({ score, total: quiz.questions.length, percentage: submission.percentage });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ error: 'Failed to submit quiz: ' + error.message });
  }
});

// Get single quiz by ID (admin)
router.get('/:id/edit', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get quiz: ' + error.message });
  }
});

// Update quiz (admin)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, totalTimeMinutes, questions, isPublished } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        totalTimeMinutes,
        isPublished: isPublished !== undefined ? isPublished : false,
        questions: questions.map((q, index) => ({
          questionText: q.question,
          correctAnswer: q.answer,
          questionOrder: index + 1,
          timeLimitSeconds: q.timeLimit || 120
        }))
      },
      { new: true }
    );
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quiz: ' + error.message });
  }
});

// Get all quizzes with pagination (admin)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || 'all';

    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (status !== 'all') {
      query.isPublished = status === 'published';
    }

    const total = await Quiz.countDocuments(query);
    const quizzes = await Quiz.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      quizzes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get quizzes: ' + error.message });
  }
});

// Delete quiz (admin)
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    // Delete all submissions related to this quiz
    await QuizSubmission.deleteMany({ quiz: req.params.id });
    console.log('Quiz and related submissions deleted:', req.params.id);
    res.json({ message: 'Quiz and all related data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quiz: ' + error.message });
  }
});

// Get quiz results (admin)
router.get('/:id/results', async (req, res) => {
  try {
    const submissions = await QuizSubmission.find({ quiz: req.params.id })
      .sort({ score: -1, submittedAt: 1 });
    
    const results = submissions.map(submission => ({
      team_name: submission.teamName,
      score: submission.score,
      submitted_at: submission.submittedAt
    }));
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get quiz results: ' + error.message });
  }
});

module.exports = router;
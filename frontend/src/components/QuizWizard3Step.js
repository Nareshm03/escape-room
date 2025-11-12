import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../utils/ToastContext';
import api from '../services/api';
import SimpleQuestionForm from './SimpleQuestionForm';
import '../styles/QuizWizard3Step.css';

const QuizWizard3Step = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    duration: 30,
    questions: [{ question: '', answer: '' }]
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  useEffect(() => {
    if (editId) {
      loadQuiz();
    }
  }, [editId]);

  const loadQuiz = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/quiz/${editId}/edit`);
      const quiz = response.data.quiz;
      setQuizData({
        title: quiz.title,
        description: quiz.description,
        duration: quiz.totalTimeMinutes,
        questions: quiz.questions.map(q => ({
          question: q.questionText,
          answer: q.correctAnswer
        }))
      });
    } catch (err) {
      showError('Failed to load quiz');
      navigate('/quiz-list');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!quizData.title.trim()) {
      showError('Title is required');
      return false;
    }
    if (!quizData.description.trim()) {
      showError('Description is required');
      return false;
    }
    if (quizData.questions.length === 0) {
      showError('Add at least one question');
      return false;
    }
    for (let q of quizData.questions) {
      if (!q.question?.trim() || !q.answer?.trim()) {
        showError('All questions must have both question and answer');
        return false;
      }
    }
    return true;
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { question: '', answer: '' }]
    });
  };

  const removeQuestion = (index) => {
    if (quizData.questions.length > 1) {
      setQuizData({
        ...quizData,
        questions: quizData.questions.filter((_, i) => i !== index)
      });
    }
  };

  const updateQuestion = (index, updatedQuestion) => {
    const updated = [...quizData.questions];
    updated[index] = updatedQuestion;
    setQuizData({ ...quizData, questions: updated });
  };

  const handleSave = async (publish = false) => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        title: quizData.title,
        description: quizData.description,
        totalTimeMinutes: quizData.duration,
        questions: quizData.questions,
        isPublished: publish
      };
      
      let response;
      if (editId) {
        response = await api.put(`/api/quiz/${editId}`, payload);
        success(publish ? 'Quiz published successfully!' : 'Quiz saved as draft!');
      } else {
        response = await api.post('/api/quiz/create', payload);
        success(publish ? 'Quiz published successfully!' : 'Quiz saved as draft!');
      }
      
      if (publish && response.data.quiz) {
        const link = `${window.location.origin}/quiz/${response.data.quiz.quizLink}`;
        navigator.clipboard.writeText(link);
        success('Quiz link copied to clipboard!');
      }
      
      navigate('/quiz-list');
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="wizard-container">
        <div className="wizard-header">
          <h1>{editId ? 'Edit Quiz' : 'Create Quiz'} - Simple Q&A</h1>
        </div>

        <div className="glass-card wizard-step">
          <h2>Quiz Information</h2>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={quizData.title}
              onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
              placeholder="Enter quiz title"
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={quizData.description}
              onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
              rows={3}
              placeholder="Describe your quiz"
            />
          </div>
          <div className="form-group">
            <label>Duration (minutes) *</label>
            <input
              type="number"
              value={quizData.duration}
              onChange={(e) => setQuizData({ ...quizData, duration: parseInt(e.target.value) || 0 })}
              min={1}
            />
          </div>
        </div>

        <div className="glass-card wizard-step">
          <div className="step-header">
            <h2>Questions</h2>
            <button onClick={addQuestion} className="btn-primary">+ Add Question</button>
          </div>
          <div className="questions-list">
            {quizData.questions.map((q, index) => (
              <SimpleQuestionForm
                key={index}
                question={q}
                index={index}
                onChange={(updated) => updateQuestion(index, updated)}
                onRemove={() => removeQuestion(index)}
              />
            ))}
          </div>
        </div>

        <div className="wizard-actions" style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => handleSave(false)} className="btn-glass" disabled={saving}>
            {saving ? 'Saving...' : '💾 Save as Draft'}
          </button>
          <button onClick={() => handleSave(true)} className="btn-primary" disabled={saving}>
            {saving ? 'Publishing...' : '🚀 Publish & Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizWizard3Step;

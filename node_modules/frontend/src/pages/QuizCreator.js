import React, { useState } from 'react';
import api from '../services/api';

const QuizCreator = () => {
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    totalTimeMinutes: 30,
    questions: [{ question: '', answer: '', timeLimit: 120 }]
  });
  const [createdQuiz, setCreatedQuiz] = useState(null);

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { question: '', answer: '', timeLimit: 120 }]
    });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index][field] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const createQuiz = async (e) => {
    e.preventDefault();
    try {
      const quizData = {
        title: quiz.title,
        description: quiz.description,
        totalTimeMinutes: quiz.totalTimeMinutes || 30,
        questions: quiz.questions.map(q => ({
          question: q.question,
          answer: q.answer,
          timeLimit: q.timeLimit || 120
        }))
      };
      const response = await api.post('/api/quiz/create', quizData);
      setCreatedQuiz(response.data);
    } catch (error) {
      console.error('Quiz creation error:', error);
      alert('Failed to create quiz');
    }
  };

  const publishQuiz = async () => {
    try {
      await api.post(`/api/quiz/${createdQuiz.quiz.id}/publish`);
      alert('Quiz published!');
    } catch (error) {
      alert('Failed to publish quiz');
    }
  };

  if (createdQuiz) {
    return (
      <div className="container">
        <div className="card scale-in" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px', animation: 'bounce-in 0.8s ease-out' }}>🎉</div>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            background: 'linear-gradient(135deg, #667eea, #43e97b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '24px'
          }}>Quiz Created Successfully!</h2>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              <span style={{ color: '#667eea' }}>🏆 Title:</span> {createdQuiz.quiz.title}
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', wordBreak: 'break-all' }}>
              <span style={{ color: '#667eea' }}>🔗 Link:</span> {window.location.origin}{createdQuiz.link}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={publishQuiz} className="btn btn-primary">
              🚀 Publish Quiz
            </button>
            <button 
              onClick={() => setCreatedQuiz(null)} 
              className="btn"
              style={{ background: '#f3f4f6', color: '#374151' }}
            >
              ➕ Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="slide-in-left" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea, #f093fb)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '12px'
        }}>
          🎨 Create Quiz
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Design engaging quizzes for your escape room challenges</p>
      </div>
      
      <div className="card fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={createQuiz}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '600' }}>
              🏆 Quiz Title
            </label>
            <input
              type="text"
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              placeholder="Enter an engaging quiz title..."
              style={{ fontSize: '16px' }}
              required
            />
          </div>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '600' }}>
              📝 Description
            </label>
            <textarea
              value={quiz.description}
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
              placeholder="Describe your quiz and its objectives..."
              style={{ minHeight: '100px', fontSize: '16px', resize: 'vertical' }}
            />
          </div>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '600' }}>
              ⏰ Total Quiz Time (minutes)
            </label>
            <input
              type="number"
              value={quiz.totalTimeMinutes}
              onChange={(e) => setQuiz({ ...quiz, totalTimeMinutes: parseInt(e.target.value) })}
              min="1"
              max="180"
              style={{ fontSize: '16px' }}
              required
            />
          </div>

          <div style={{ marginTop: '40px' }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#374151',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ❓ Questions ({quiz.questions.length})
            </h3>
            
            {quiz.questions.map((q, index) => (
              <div key={index} className="scale-in" style={{ 
                animationDelay: `${index * 0.1}s`,
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '20px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Question {index + 1}
                </div>
                
                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>
                    💬 Question Text
                  </label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                    placeholder="Enter your question here..."
                    style={{ fontSize: '15px' }}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>
                    ✅ Correct Answer
                  </label>
                  <input
                    type="text"
                    value={q.answer}
                    onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                    placeholder="Enter the correct answer..."
                    style={{ fontSize: '15px' }}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>
                    ⏱️ Time Limit (seconds)
                  </label>
                  <input
                    type="number"
                    value={q.timeLimit}
                    onChange={(e) => updateQuestion(index, 'timeLimit', parseInt(e.target.value))}
                    min="10"
                    max="600"
                    style={{ fontSize: '15px' }}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            justifyContent: 'center',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '2px solid #f1f5f9'
          }}>
            <button 
              type="button" 
              onClick={addQuestion} 
              className="btn"
              style={{ 
                background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
                color: 'white',
                minWidth: '140px'
              }}
            >
              ➕ Add Question
            </button>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ minWidth: '140px' }}
            >
              🎨 Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizCreator;
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get('/quiz');
      setQuizzes(response.data);
    } catch (error) {
      alert('Failed to fetch quizzes');
    }
  };

  const fetchResults = async (quizId) => {
    try {
      const response = await api.get(`/quiz/${quizId}/results`);
      setResults(response.data);
      setSelectedQuiz(quizId);
    } catch (error) {
      alert('Failed to fetch results');
    }
  };

  return (
    <div className="container">
      <h2>Quiz Management</h2>
      
      <div className="card">
        <h3>All Quizzes</h3>
        {quizzes.map(quiz => (
          <div key={quiz.id} className="card" style={{ marginBottom: '16px' }}>
            <h4>{quiz.title}</h4>
            <p>{quiz.description}</p>
            <p><strong>Status:</strong> {quiz.is_published ? 'Published' : 'Draft'}</p>
            <p><strong>Link:</strong> {window.location.origin}/quiz/{quiz.quiz_link}</p>
            <button 
              onClick={() => fetchResults(quiz.id)} 
              className="btn btn-primary"
            >
              View Results
            </button>
          </div>
        ))}
      </div>

      {selectedQuiz && (
        <div className="card">
          <h3>Quiz Results</h3>
          {results.length === 0 ? (
            <p>No submissions yet</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Team Name</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Score</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.team_name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.score}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {new Date(result.submitted_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizList;
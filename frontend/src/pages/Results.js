import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get('/results');
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  return (
    <div className="container">
      <h1>Results</h1>
      
      <div className="card">
        <h2>Team Results</h2>
        {results.length === 0 ? (
          <p>No quiz results available</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Team Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quiz</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Score</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Percentage</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.team_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.quiz_title}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{result.score} / {result.total_questions}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {Math.round((result.score / result.total_questions) * 100)}%
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {new Date(result.submitted_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Results;
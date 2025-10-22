import React, { useState } from 'react';

const SQLPuzzle = ({ puzzle, onSubmit, submitting, message }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(answer);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '24px', marginRight: '10px' }}>🗄️</span>
        <h3>SQL Challenge</h3>
      </div>
      
      <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '4px', marginBottom: '20px' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
          {puzzle.puzzle_text}
        </p>
      </div>

      {puzzle.hint && (
        <div style={{ 
          backgroundColor: '#d1ecf1', 
          padding: '12px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          borderLeft: '4px solid #17a2b8'
        }}>
          <strong>💡 Hint:</strong> {puzzle.hint}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Answer:</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter SQL operator or query..."
            required
            disabled={submitting}
            style={{ fontSize: '16px', fontFamily: 'monospace' }}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={submitting || !answer.trim()}
          style={{ fontSize: '16px', padding: '12px 24px' }}
        >
          {submitting ? 'Checking...' : 'Submit Answer'}
        </button>
      </form>

      {message && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          borderRadius: '4px',
          backgroundColor: message.includes('Correct') ? '#d4edda' : '#f8d7da',
          color: message.includes('Correct') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('Correct') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default SQLPuzzle;
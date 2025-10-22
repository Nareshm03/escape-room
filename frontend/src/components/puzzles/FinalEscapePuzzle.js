import React, { useState } from 'react';
import api from '../../services/api';

const FinalEscapePuzzle = ({ puzzle, gameState }) => {
  const [finalCode, setFinalCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!finalCode.trim()) return;

    setSubmitting(true);

    try {
      const response = await api.post('/game/final-code', { finalCode });
      setResult(response.data);
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.error || 'Error submitting final code',
        submissionTime: new Date(),
        ...(error.response?.data || {})
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Check if already submitted
  const alreadySubmitted = gameState?.finalCodeSubmitted || result;

  return (
    <div className="card">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <span style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}>🏆</span>
        <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>FINAL ESCAPE CHALLENGE</h2>
        <p style={{ color: '#666', fontSize: '18px' }}>Team: {gameState?.team?.name}</p>
      </div>

      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '2px solid #ffc107'
      }}>
        <h3 style={{ color: '#856404', marginBottom: '15px' }}>📋 Instructions</h3>
        <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
          {puzzle?.puzzle_text}
        </p>
      </div>

      {puzzle?.hint && (
        <div style={{ 
          backgroundColor: '#d1ecf1', 
          padding: '16px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          borderLeft: '4px solid #17a2b8'
        }}>
          <strong>💡 Hint:</strong> {puzzle.hint}
        </div>
      )}

      <div style={{ 
        backgroundColor: '#f8d7da', 
        padding: '16px', 
        borderRadius: '4px', 
        marginBottom: '20px',
        border: '1px solid #f5c6cb'
      }}>
        <strong>⚠️ WARNING:</strong> You have only ONE attempt to submit the final escape code. 
        Make sure you have the correct combination before submitting!
      </div>

      {!alreadySubmitted ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Final Escape Code:
            </label>
            <input
              type="text"
              value={finalCode}
              onChange={(e) => setFinalCode(e.target.value.toUpperCase())}
              placeholder="Enter the combined final escape code..."
              required
              disabled={submitting}
              style={{ 
                fontSize: '20px', 
                padding: '15px',
                textAlign: 'center',
                fontWeight: 'bold',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}
            />
            <small style={{ color: '#666', fontSize: '14px' }}>
              Enter the code exactly as you determined from all puzzle solutions
            </small>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={submitting || !finalCode.trim()}
              style={{ 
                fontSize: '18px', 
                padding: '15px 40px',
                backgroundColor: '#dc3545',
                borderColor: '#dc3545'
              }}
            >
              {submitting ? '🔄 SUBMITTING...' : '🚀 SUBMIT FINAL CODE'}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            padding: '30px',
            borderRadius: '8px',
            backgroundColor: result?.success ? '#d4edda' : '#f8d7da',
            border: `2px solid ${result?.success ? '#c3e6cb' : '#f5c6cb'}`,
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>
              {result?.success ? '🎉' : '❌'}
            </div>
            <h3 style={{ 
              color: result?.success ? '#155724' : '#721c24',
              marginBottom: '15px'
            }}>
              {result?.success ? 'ESCAPE SUCCESSFUL!' : 'ESCAPE FAILED'}
            </h3>
            <p style={{ 
              fontSize: '18px',
              color: result?.success ? '#155724' : '#721c24',
              marginBottom: '20px'
            }}>
              {result?.message}
            </p>
            
            <div style={{ 
              fontSize: '14px', 
              color: '#666',
              borderTop: '1px solid #ddd',
              paddingTop: '15px'
            }}>
              <p><strong>Submission Time:</strong> {new Date(result?.submissionTime).toLocaleString()}</p>
              {result?.previousAttempt && (
                <p><strong>Your Code:</strong> {result.previousAttempt}</p>
              )}
            </div>
          </div>
          
          {result?.success && (
            <div style={{ 
              backgroundColor: '#e7f3ff', 
              padding: '20px', 
              borderRadius: '8px',
              fontSize: '16px'
            }}>
              <h4>🏅 Congratulations!</h4>
              <p>Your team has successfully completed the Escape Room challenge!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinalEscapePuzzle;
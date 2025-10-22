import React, { useState } from 'react';
import api from '../../services/api';

const CryptographyPuzzle = ({ puzzle, onSubmit, submitting, message }) => {
  const [answer, setAnswer] = useState('');
  const [showTools, setShowTools] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState('');
  const [testMethod, setTestMethod] = useState('caesar');
  const [caesarShift, setCaesarShift] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(answer);
  };

  const detectCipherType = () => {
    const text = puzzle.puzzle_text.toLowerCase();
    if (text.includes('caesar')) return 'Caesar Cipher';
    if (text.includes('base64')) return 'Base64 Encoding';
    if (text.includes('substitution') || text.includes('a=1')) return 'Substitution Cipher';
    if (text.includes('rot13')) return 'ROT13 Cipher';
    if (text.includes('mixed')) return 'Mixed Cryptography';
    return 'Unknown Cipher';
  };

  const getCipherInfo = () => {
    const type = detectCipherType();
    const info = {
      'Caesar Cipher': 'Shifts each letter by a fixed number of positions in the alphabet.',
      'Base64 Encoding': 'Encodes binary data using 64 printable ASCII characters.',
      'Substitution Cipher': 'Replaces each letter with a number (A=1, B=2, etc.).',
      'ROT13 Cipher': 'Special case of Caesar cipher with a shift of 13.',
      'Mixed Cryptography': 'Combines multiple encryption methods.',
      'Unknown Cipher': 'Analyze the pattern to determine the cipher type.'
    };
    return { type, description: info[type] };
  };

  const testDecode = async () => {
    if (!testInput.trim()) return;
    
    try {
      const response = await api.post('/crypto/decode', {
        text: testInput,
        method: testMethod,
        shift: testMethod === 'caesar' ? caesarShift : undefined
      });
      setTestResult(response.data.decoded);
    } catch (error) {
      setTestResult('Error: ' + (error.response?.data?.error || 'Failed to decode'));
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', marginRight: '10px' }}>🔐</span>
          <div>
            <h3>Cryptography Challenge</h3>
            <small style={{ color: '#666' }}>{getCipherInfo().type}</small>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => setShowTools(!showTools)}
          style={{ 
            background: 'none', 
            border: '1px solid #007bff', 
            color: '#007bff',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {showTools ? 'Hide Tools' : 'Show Tools'}
        </button>
      </div>
      
      {showTools && (
        <div style={{ 
          backgroundColor: '#e9ecef', 
          padding: '12px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          <strong>Cipher Info:</strong> {getCipherInfo().description}
          <br />
          <strong>Quick Test:</strong>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select 
              value={testMethod} 
              onChange={(e) => setTestMethod(e.target.value)}
              style={{ padding: '4px', fontSize: '12px' }}
            >
              <option value="caesar">Caesar</option>
              <option value="base64">Base64</option>
              <option value="substitution">Substitution</option>
              <option value="rot13">ROT13</option>
            </select>
            {testMethod === 'caesar' && (
              <input
                type="number"
                value={caesarShift}
                onChange={(e) => setCaesarShift(e.target.value)}
                min="1"
                max="25"
                style={{ width: '50px', padding: '4px', fontSize: '12px' }}
                placeholder="Shift"
              />
            )}
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Test text..."
              style={{ padding: '4px', fontSize: '12px', minWidth: '100px' }}
            />
            <button
              type="button"
              onClick={testDecode}
              style={{ 
                padding: '4px 8px', 
                fontSize: '12px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Test
            </button>
          </div>
          {testResult && (
            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '3px', fontSize: '12px' }}>
              <strong>Result:</strong> {testResult}
            </div>
          )}
        </div>
      )}
      
      <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '4px', marginBottom: '20px' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0, fontFamily: 'monospace' }}>
          {puzzle.puzzle_text}
        </p>
      </div>

      {puzzle.hint && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          padding: '12px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          borderLeft: '4px solid #dc3545'
        }}>
          <strong>💡 Hint:</strong> {puzzle.hint}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Decrypted Message:</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your decrypted answer here..."
            required
            disabled={submitting}
            rows={3}
            style={{ 
              fontSize: '16px', 
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            Tip: Enter the final decrypted text, not the cipher process
          </small>
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

export default CryptographyPuzzle;
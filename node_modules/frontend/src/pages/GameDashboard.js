import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useSettings } from '../utils/SettingsContext';

const GameDashboard = () => {
  const { settings } = useSettings();
  const [stages, setStages] = useState([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);

  useEffect(() => {
    fetchStages();
    if (settings.hasTimeLimit) {
      setTotalTimeLeft(settings.timeLimit * 60);
    }
    if (settings.pageTimeLimits) {
      setTimeLeft(settings.defaultPageTimeLimit);
    }
  }, [settings]);

  useEffect(() => {
    if (!settings.hasTimeLimit && !settings.pageTimeLimits) return;

    const timer = setInterval(() => {
      if (settings.pageTimeLimits) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setMessage('⏰ Time up for this stage!');
            return 0;
          }
          return prev - 1;
        });
      }

      if (settings.hasTimeLimit) {
        setTotalTimeLeft(prev => {
          if (prev <= 1) {
            setMessage('⏰ Total game time is up!');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [settings, currentStage]);

  const fetchStages = async () => {
    try {
      const response = await api.get('/game/stages');
      setStages(response.data);
    } catch (error) {
      setMessage('Error loading game');
    }
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    if (settings.confirmBeforeSubmit) {
      if (!window.confirm('Are you sure you want to submit this answer?')) {
        return;
      }
    }

    try {
      const response = await api.post('/game/submit', { 
        stageId: stages[currentStage]?.id, 
        answer 
      });
      
      setMessage(response.data.message);
      
      if (response.data.correct && currentStage < stages.length - 1) {
        setCurrentStage(currentStage + 1);
        setAnswer('');
        if (settings.pageTimeLimits) {
          setTimeLeft(settings.defaultPageTimeLimit);
        }
      }
    } catch (error) {
      setMessage('Error submitting answer');
    }
  };

  if (stages.length === 0) {
    return <div className="container">Loading game...</div>;
  }

  const stage = stages[currentStage];
  
  if (currentStage >= stages.length) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          {settings.showPageTitles && <h1>🎉 Congratulations!</h1>}
          <p>You completed all stages!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        {(settings.hasTimeLimit || settings.pageTimeLimits) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div></div>
            <div style={{ textAlign: 'right' }}>
              {settings.pageTimeLimits && (
                <div style={{ color: timeLeft <= 10 ? '#dc3545' : '#666', fontSize: '14px' }}>
                  Stage Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
              )}
              {settings.hasTimeLimit && (
                <div style={{ color: totalTimeLeft <= 60 ? '#dc3545' : '#666', fontSize: '12px' }}>
                  Total Time: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          </div>
        )}
        {settings.showPageTitles && <h2>Stage {stage.stage_number}: {stage.title}</h2>}
        <p>{stage.puzzle_text}</p>
        
        <form onSubmit={submitAnswer}>
          <div className="form-group">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={(settings.pageTimeLimits && timeLeft === 0) || (settings.hasTimeLimit && totalTimeLeft === 0)}
          >
            Submit
          </button>
        </form>
        
        {message && <div style={{ marginTop: '16px' }}>{message}</div>}
        
        {settings.showProgressBar && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e9ecef', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((currentStage + 1) / stages.length) * 100}%`,
                height: '100%',
                backgroundColor: '#28a745',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px', color: '#666' }}>
              Progress: {currentStage + 1} / {stages.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDashboard;
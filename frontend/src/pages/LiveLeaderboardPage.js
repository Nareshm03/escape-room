import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const LiveLeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setError('');
      const response = await api.get('/api/leaderboard');
      console.log('Leaderboard response:', response.data);
      setLeaderboard(response.data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '🏆';
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0: return 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
      case 1: return 'linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%)';
      case 2: return 'linear-gradient(135deg, #cd7f32 0%, #daa520 100%)';
      default: return 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <LoadingSpinner size="large" text="Loading leaderboard..." />
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="welcome-title" style={{ fontSize: '2.5rem', marginBottom: '40px' }}>
        🔴 Live Leaderboard
      </h1>
      
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
      
      <div className="card fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            fontSize: '1.8rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🏆 Top Teams
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="loading" style={{ width: '16px', height: '16px' }}></div>
            <span style={{ color: '#718096', fontSize: '14px' }}>Auto-refreshing...</span>
          </div>
        </div>
        
        {leaderboard.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: '12px',
            border: '2px dashed rgba(102, 126, 234, 0.2)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏆</div>
            <h3 style={{ color: '#4a5568', marginBottom: '12px' }}>No Quiz Submissions Yet</h3>
            <p style={{ color: '#718096' }}>Complete quizzes to see teams on the leaderboard!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {leaderboard.map((team, index) => (
              <div 
                key={`${team.team_name}-${index}`} 
                className="card hover-lift fade-in" 
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  background: getRankColor(index),
                  border: index < 3 ? '2px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(102, 126, 234, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Rank Badge */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  width: '60px',
                  height: '60px',
                  background: index < 3 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '14px',
                  transform: 'rotate(15deg)'
                }}>
                  #{index + 1}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '2rem' }}>{getRankIcon(index)}</span>
                      <h3 style={{ 
                        color: '#4a5568', 
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        margin: '0'
                      }}>
                        {team.team_name}
                      </h3>
                    </div>
                    
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.7)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      display: 'inline-block',
                      marginBottom: '8px'
                    }}>
                      <span style={{ color: '#4a5568', fontWeight: '600', fontSize: '14px' }}>
                        📝 Quiz: {team.quiz_title}
                      </span>
                    </div>
                    
                    <div style={{ color: '#718096', fontSize: '13px' }}>
                      🕰️ Submitted: {new Date(team.submitted_at).toLocaleString()}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right', marginLeft: '20px' }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      padding: '16px',
                      borderRadius: '12px',
                      minWidth: '120px'
                    }}>
                      <div style={{ 
                        fontSize: '2rem', 
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '4px'
                      }}>
                        {team.score}/{team.total_questions}
                      </div>
                      <div style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: '600',
                        color: team.percentage >= 80 ? '#48bb78' : team.percentage >= 60 ? '#ed8936' : '#f56565',
                        marginBottom: '4px'
                      }}>
                        {team.percentage}%
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#718096',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Accuracy
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveLeaderboardPage;
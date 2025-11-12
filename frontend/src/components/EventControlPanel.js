import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../utils/ToastContext';
import './EventControlPanel.css';

const EventControlPanel = () => {
  const [gameId, setGameId] = useState('');
  const [gameStatus, setGameStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchActiveGame();
  }, []);

  const fetchActiveGame = async () => {
    try {
      const response = await api.get('/event/status/active');
      if (response.data && response.data._id) {
        setGameId(response.data._id);
        setGameStatus(response.data);
      }
    } catch (err) {
      // No active game, ignore
    }
  };

  const fetchGameStatus = async () => {
    if (!gameId) return;
    
    try {
      const response = await api.get(`/event/status/${gameId}`);
      setGameStatus(response.data);
    } catch (err) {
      showError('Failed to fetch game status');
    }
  };

  const handleAction = async (action) => {
    if (!gameId) {
      showError('Please enter a Game ID');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/event/${action}`, 
        { gameId },
        { headers: { 'x-admin-key': 'dev-admin-key' } }
      );
      
      success(response.data.message);
      setGameStatus(response.data.game);
    } catch (err) {
      showError(err.response?.data?.error || `Failed to ${action} game`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!gameStatus) return '#6c757d';
    if (gameStatus.isActive) return '#28a745';
    if (gameStatus.isCompleted) return '#007bff';
    return '#ffc107';
  };

  const getStatusText = () => {
    if (!gameStatus) return 'Unknown';
    if (gameStatus.isActive) return 'Active';
    if (gameStatus.isCompleted) return 'Completed';
    return 'Inactive';
  };

  return (
    <div className="event-control-panel" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#e6eef8', marginBottom: '24px', letterSpacing: '-0.5px' }}>🎮 Event Control Panel</h2>
      
      <div className="control-section">
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#e6eef8', fontWeight: '600' }}>Game ID</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Enter game ID..."
              className="game-id-input"
              style={{ flex: 1, padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#e6eef8' }}
            />
            <button 
              onClick={fetchGameStatus}
              className="btn-secondary"
              disabled={!gameId || loading}
              style={{ padding: '12px 24px', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              Refresh Status
            </button>
          </div>
        </div>

        {gameStatus && (
          <div className="status-indicator" style={{ borderColor: getStatusColor(), padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', marginBottom: '24px', border: `2px solid ${getStatusColor()}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="status-dot" style={{ backgroundColor: getStatusColor(), width: '12px', height: '12px', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
              <div className="status-info" style={{ color: '#e6eef8' }}>
                <strong style={{ fontSize: '16px' }}>Status:</strong> <span style={{ color: getStatusColor(), fontWeight: '600' }}>{getStatusText()}</span>
                <br />
                <small style={{ color: 'rgba(230, 238, 248, 0.7)' }}>Event: {gameStatus.eventName}</small>
                {gameStatus.startTime && (
                  <>
                    <br />
                    <small style={{ color: 'rgba(230, 238, 248, 0.7)' }}>Started: {new Date(gameStatus.startTime).toLocaleString()}</small>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="action-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <button
            onClick={() => handleAction('start')}
            disabled={loading || (gameStatus?.isActive && !gameStatus?.isCompleted)}
            className="btn-start"
            style={{ padding: '14px 20px', background: 'linear-gradient(135deg, #48bb78, #38a169)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', opacity: (loading || (gameStatus?.isActive && !gameStatus?.isCompleted)) ? 0.5 : 1 }}
          >
            ▶️ Start
          </button>
          <button
            onClick={() => handleAction('pause')}
            disabled={loading || !gameStatus?.isActive}
            className="btn-pause"
            style={{ padding: '14px 20px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', opacity: (loading || !gameStatus?.isActive) ? 0.5 : 1 }}
          >
            ⏸️ Pause
          </button>
          <button
            onClick={() => handleAction('reset')}
            disabled={loading}
            className="btn-reset"
            style={{ padding: '14px 20px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', opacity: loading ? 0.5 : 1 }}
          >
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventControlPanel;

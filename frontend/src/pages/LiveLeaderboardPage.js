import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import PodiumWidget from '../components/PodiumWidget';
import LeaderboardEntry from '../components/LeaderboardEntry';
import { useToast } from '../utils/ToastContext';
import '../styles/design-tokens.css';
import '../styles/LiveLeaderboard.css';

const LiveLeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [rankChanges, setRankChanges] = useState({});
  const previousLeaderboard = useRef([]);
  const toast = useToast();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await api.get('/api/leaderboard');
      const newData = response.data || [];
      
      // Detect rank changes
      const changes = {};
      newData.forEach((entry, index) => {
        const oldIndex = previousLeaderboard.current.findIndex(
          (old) => old.team_name === entry.team_name
        );
        if (oldIndex !== -1 && oldIndex !== index) {
          changes[entry.team_name] = true;
        }
      });
      
      setRankChanges(changes);
      previousLeaderboard.current = newData;
      setLeaderboard(newData);
      setLastUpdate(new Date());
      
      // Clear rank change indicators after animation
      setTimeout(() => setRankChanges({}), 300);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      if (loading) {
        toast.error('Failed to load leaderboard. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [loading, toast]);

  const formatTimestamp = (date) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.success(autoRefresh ? 'Auto-refresh disabled' : 'Auto-refresh enabled');
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="skeleton-podium">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-podium-item" />
          ))}
        </div>
        <div className="skeleton-entries">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-entry" />
          ))}
        </div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="leaderboard-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <div className="leaderboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>🔴 Live Leaderboard</h1>
        <div className="leaderboard-controls" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            className={`refresh-toggle ${autoRefresh ? 'active' : ''}`}
            onClick={toggleAutoRefresh}
            aria-label={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
            aria-pressed={autoRefresh}
            style={{ padding: '10px 20px', background: autoRefresh ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span className="toggle-icon">{autoRefresh ? '⏸️' : '▶️'}</span>
            <span className="toggle-label">{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
          </button>
          <div className="last-update" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span className="update-label" style={{ fontSize: '0.85rem', color: 'rgba(230, 238, 248, 0.7)' }}>Last update:</span>
            <time className="update-time" style={{ fontSize: '1rem', fontWeight: '600', color: '#e6eef8' }}>{formatTimestamp(lastUpdate)}</time>
          </div>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <motion.div
          className="empty-leaderboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="empty-icon">🏆</div>
          <h2>No Submissions Yet</h2>
          <p>Complete quizzes to see teams on the leaderboard!</p>
        </motion.div>
      ) : (
        <>
          {topThree.length > 0 && <PodiumWidget topThree={topThree} />}

          <div className="leaderboard-list">
            <AnimatePresence mode="popLayout">
              {leaderboard.map((entry, index) => (
                <LeaderboardEntry
                  key={entry.team_name}
                  entry={entry}
                  rank={index + 1}
                  onRankChange={rankChanges[entry.team_name]}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveLeaderboardPage;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/LeaderboardEntry.css';

const LeaderboardEntry = ({ entry, rank, onRankChange }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTierGradient = (rank) => {
    switch (rank) {
      case 1:
        return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
      case 2:
        return 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
      case 3:
        return 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)';
      default:
        return 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="leaderboard-entry"
      style={{ background: getTierGradient(rank) }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: rank * 0.05 }}
      whileHover={{ y: -4 }}
      layout
    >
      <div className="entry-rank">
        <motion.div
          className="rank-badge"
          animate={onRankChange ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {rank <= 3 ? (
            <span className="medal">{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</span>
          ) : (
            <span className="rank-number">#{rank}</span>
          )}
        </motion.div>
      </div>

      <div className="entry-content" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <div className="entry-main" style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <h3 className="entry-name" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: 0 }}>{entry.team_name}</h3>
          <div className="entry-score" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="score-value" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{entry.percentage}%</span>
            <span className="score-detail" style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>{entry.score}/{entry.total_questions}</span>
          </div>
        </div>

        <motion.div
          className="entry-stats"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-item">
            <span className="stat-icon">⏱️</span>
            <span className="stat-label">Time:</span>
            <span className="stat-value">{formatTime(entry.completion_time || 180)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💡</span>
            <span className="stat-label">Hints:</span>
            <span className="stat-value">{entry.hints_used || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🎯</span>
            <span className="stat-label">Accuracy:</span>
            <span className="stat-value">{entry.percentage}%</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeaderboardEntry;

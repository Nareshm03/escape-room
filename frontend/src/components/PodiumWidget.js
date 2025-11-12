import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/PodiumWidget.css';

const PodiumWidget = ({ topThree }) => {
  const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd for visual layout

  return (
    <div className="podium-widget">
      <AnimatePresence mode="wait">
        {podiumOrder.map((index) => {
          const player = topThree[index];
          if (!player) return null;

          const position = index + 1;
          const height = position === 1 ? 120 : position === 2 ? 100 : 80;

          return (
            <motion.div
              key={player.team_name}
              className={`podium-position podium-${position}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              style={{ height: `${height}px` }}
            >
              <motion.div
                className="podium-medal"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3, delay: 0.5 }}
                style={{ fontSize: '3rem', marginBottom: '12px' }}
              >
                {position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉'}
              </motion.div>
              <div className="podium-name" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '8px', textAlign: 'center' }}>{player.team_name}</div>
              <div className="podium-score" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{player.percentage}%</div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default PodiumWidget;

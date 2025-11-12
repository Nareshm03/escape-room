import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../utils/ToastContext';
import AdminControlPanel from '../components/AdminControlPanel';
import QuizShortcut from '../components/QuizShortcut';
import EventControlPanel from '../components/EventControlPanel';
import '../styles/AdminDashboard.css';

const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span className="numeric">{count}</span>;
};

const StatCard = ({ icon, value, label, progress, delay }) => (
  <motion.div
    className="glass-card stat-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">
      <AnimatedCounter value={value} />
    </div>
    <div className="stat-label">{label}</div>
    {progress !== undefined && (
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: delay + 0.3 }}
        />
      </div>
    )}
  </motion.div>
);

const QuickActionButton = ({ to, gradient, icon, label, delay }) => {
  const navigate = useNavigate();
  
  return (
    <motion.button
      className="quick-action-btn"
      style={{ background: gradient }}
      onClick={() => navigate(to)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="action-icon">{icon}</span>
      <span className="action-label">{label}</span>
    </motion.button>
  );
};

const ControlCard = ({ to, icon, title, description, delay }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className="glass-card control-card"
      onClick={() => navigate(to)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)' }}
    >
      <div className="control-icon">{icon}</div>
      <h3 className="control-title">{title}</h3>
      <p className="control-desc">{description}</p>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTeams: 0,
    activeGames: 0,
    completedSessions: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data);
    } catch (err) {
      showError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (value, max) => Math.min((value / max) * 100, 100);

  return (
    <div className="page-container" style={{ maxWidth: '1400px', padding: '40px 24px' }}>
      <motion.div
        className="admin-dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px',
            letterSpacing: '-1px'
          }}>Admin Dashboard</h1>
          <p style={{ 
            fontSize: '18px', 
            color: 'rgba(230, 238, 248, 0.8)', 
            lineHeight: '1.6' 
          }}>Manage your escape room platform</p>
        </div>

        {/* Header Summary Zone */}
        <div className="summary-zone" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <StatCard
            icon="👥"
            value={stats.totalTeams}
            label="Total Teams"
            progress={calculateProgress(stats.totalTeams, 50)}
            delay={0}
          />
          <StatCard
            icon="🎮"
            value={stats.activeGames}
            label="Active Games"
            progress={calculateProgress(stats.activeGames, 20)}
            delay={0.1}
          />
          <StatCard
            icon="✓"
            value={stats.completedSessions}
            label="Completed Sessions"
            progress={calculateProgress(stats.completedSessions, 100)}
            delay={0.2}
          />
          <StatCard
            icon="⭐"
            value={stats.averageScore}
            label="Average Score"
            progress={stats.averageScore}
            delay={0.3}
          />
        </div>

        {/* Quick Actions Zone */}
        <div className="actions-zone" style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#e6eef8',
            marginBottom: '24px',
            letterSpacing: '-0.5px'
          }}>Quick Actions</h2>
          <div className="actions-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <QuickActionButton
              to="/teams"
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              icon="👥"
              label="Manage Teams"
              delay={0.4}
            />
            <QuickActionButton
              to="/game"
              gradient="linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
              icon="🎮"
              label="Play Game"
              delay={0.5}
            />
            <QuickActionButton
              to="/results"
              gradient="linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)"
              icon="📊"
              label="View Results"
              delay={0.6}
            />
            <QuickActionButton
              to="/live"
              gradient="linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)"
              icon="🏆"
              label="Live Leaderboard"
              delay={0.7}
            />
          </div>
        </div>

        {/* Admin Control Panel */}
        <div style={{ marginBottom: '32px' }}>
          <AdminControlPanel />
        </div>

        {/* Clear Data Section */}
        <div style={{ marginBottom: '32px', padding: '24px', background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', borderRadius: '12px' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '12px', fontSize: '1.25rem', fontWeight: '700' }}>⚠️ Danger Zone</h3>
          <p style={{ color: '#e6eef8', marginBottom: '16px', fontSize: '0.95rem' }}>Clear all quiz submissions, results, and leaderboard data. This action cannot be undone.</p>
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete ALL quiz submissions and results? This cannot be undone!')) {
                try {
                  await api.delete('/api/results/clear-all');
                  success('All data cleared successfully!');
                  fetchStats();
                } catch (err) {
                  showError('Failed to clear data');
                }
              }
            }}
            style={{ padding: '12px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
          >
            🗑️ Clear All Data
          </button>
        </div>

        {/* Event Control Panel */}
        <div style={{ marginBottom: '48px' }}>
          <EventControlPanel />
        </div>

        {/* Admin Control Zone */}
        <div className="control-zone">
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#e6eef8',
            marginBottom: '24px',
            letterSpacing: '-0.5px'
          }}>Admin Controls</h2>
          <div className="control-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            <ControlCard
              to="/admin/event-control"
              icon="📅"
              title="Event Control Panel"
              description="Start, pause, or manage event settings"
              delay={0.8}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 }}
            >
              <QuizShortcut />
            </motion.div>
            <ControlCard
              to="/settings"
              icon="⚙️"
              title="Settings"
              description="Configure application preferences"
              delay={1.0}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;

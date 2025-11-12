import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import '../styles/navigation.css';

const GlassNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="glass-nav">
      <div className="glass-nav-content">
        <div className="glass-nav-logo">Escape Room</div>
        <div className="glass-nav-links">
          <Link to="/" className={`glass-nav-link ${isActive('/') ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/teams" className={`glass-nav-link ${isActive('/teams') ? 'active' : ''}`}>
            Teams
          </Link>
          <Link to="/quiz-list" className={`glass-nav-link ${isActive('/quiz-list') ? 'active' : ''}`}>
            Quizzes
          </Link>
          <Link to="/results" className={`glass-nav-link ${isActive('/results') ? 'active' : ''}`}>
            Results
          </Link>
          <Link to="/live" className={`glass-nav-link ${isActive('/live') ? 'active' : ''}`}>
            🔴 Live
          </Link>
          {user?.email === 'admin@escaperoom.com' && (
            <Link to="/admin" className={`glass-nav-link ${isActive('/admin') ? 'active' : ''}`}>
              ⚡ Admin
            </Link>
          )}
          <button onClick={logout} className="btn-glass" style={{ padding: '8px 16px', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default GlassNavbar;

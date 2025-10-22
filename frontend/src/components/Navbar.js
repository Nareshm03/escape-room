import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useSettings } from '../utils/SettingsContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = {
    textDecoration: 'none',
    color: '#64748b',
    fontWeight: '500',
    fontSize: '14px',
    padding: '10px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const activeNavLinkStyle = {
    ...navLinkStyle,
    background: '#667eea',
    color: 'white',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
  };

  const adminLinkStyle = {
    ...navLinkStyle,
    background: '#f8fafc',
    color: '#667eea',
    border: '1px solid #e2e8f0',
    fontWeight: '500'
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          {settings.showQuizName && (
            <Link to="/" style={{
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}>
              🏢 {settings.quizName || 'Escape Room Challenge'}
            </Link>
          )}
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Link 
                to="/teams" 
                style={isActive('/teams') ? activeNavLinkStyle : navLinkStyle}
                onMouseEnter={(e) => {
                  if (!isActive('/teams')) {
                    e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/teams')) {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                👥 Teams
              </Link>
              <Link 
                to="/game" 
                style={isActive('/game') ? activeNavLinkStyle : navLinkStyle}
                onMouseEnter={(e) => {
                  if (!isActive('/game')) {
                    e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/game')) {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                🎮 Game
              </Link>
              <Link 
                to="/results" 
                style={isActive('/results') ? activeNavLinkStyle : navLinkStyle}
                onMouseEnter={(e) => {
                  if (!isActive('/results')) {
                    e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/results')) {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                📊 Results
              </Link>
              <Link 
                to="/live" 
                style={isActive('/live') ? activeNavLinkStyle : navLinkStyle}
                onMouseEnter={(e) => {
                  if (!isActive('/live')) {
                    e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/live')) {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                🔴 Live
              </Link>
              {user.email === 'admin@escaperoom.com' && (
                <div style={{ display: 'flex', gap: '4px', marginLeft: '8px', paddingLeft: '8px', borderLeft: '1px solid #e2e8f0' }}>
                  <Link to="/admin" style={adminLinkStyle}>⚡ Admin</Link>
                  <Link to="/quiz-creator" style={adminLinkStyle}>➕ Create</Link>
                  <Link to="/quiz-list" style={adminLinkStyle}>📋 Quizzes</Link>
                  <Link to="/settings" style={adminLinkStyle}>⚙️ Settings</Link>
                </div>
              )}
              <div style={{
                background: '#f1f5f9',
                color: '#334155',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                marginLeft: '12px',
                border: '1px solid #e2e8f0'
              }}>
                👋 {user.name}
              </div>
              <button 
                onClick={handleLogout} 
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                onMouseLeave={(e) => e.target.style.background = '#ef4444'}
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/login" className="btn btn-primary">🔑 Login</Link>
              <Link to="/register" className="btn btn-primary">📝 Register</Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
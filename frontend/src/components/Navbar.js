import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';
import { useSettings } from '../utils/SettingsContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState('light');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@escaperoom.com';

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '⊞' },
    { path: '/teams', label: 'Teams', icon: '👥' },
    { path: '/game', label: 'Game', icon: '🎮' },
    { path: '/results', label: 'Results', icon: '🏆' },
    { path: '/live', label: 'Live', icon: '📡' }
  ];

  const adminNavItems = isAdmin ? [
    { path: '/admin', label: 'Admin Panel', icon: '🛠️' }
  ] : [];

  const adminItems = [
    { path: '/quiz-creator', label: 'Create', icon: '➕' },
    { path: '/quiz-list', label: 'Quizzes', icon: '📋' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <nav className="glassmorphism-navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        {settings.showQuizName && (
          <Link to="/" className="navbar-logo" aria-label="Home">
            🏢 {settings.quizName || 'Escape Room Challenge'}
          </Link>
        )}

        {user ? (
          <>
            <div className={`navbar-main ${mobileMenuOpen ? 'open' : ''}`}>
              {[...navItems, ...adminNavItems].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  data-testid={item.path === '/admin' ? 'admin-panel-link' : undefined}
                >
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  {item.label}
                  {isActive(item.path) && (
                    <motion.div
                      className="nav-underline"
                      layoutId="underline"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="navbar-right">
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                data-theme={theme}
              >
                <div className="theme-toggle-slider">
                  <span className="theme-toggle-icon" aria-hidden="true">
                    {theme === 'light' ? '☀️' : '🌙'}
                  </span>
                </div>
              </button>

              <div className="user-dropdown" ref={dropdownRef}>
                <motion.button
                  className="user-avatar"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="dropdown-menu"
                      role="menu"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="dropdown-header">{user.name}</div>
                      
                      {isAdmin && (
                        <>
                          <div className="dropdown-header">Admin</div>
                          {adminItems.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className="dropdown-item"
                              onClick={() => setDropdownOpen(false)}
                              role="menuitem"
                            >
                              <span aria-hidden="true">{item.icon}</span>
                              {item.label}
                            </Link>
                          ))}
                          <div className="dropdown-divider" />
                        </>
                      )}
                      
                      <button
                        className="dropdown-item danger"
                        onClick={handleLogout}
                        role="menuitem"
                      >
                        <span aria-hidden="true">🚪</span>
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="navbar-right">
            <Link to="/login" className="btn btn-primary">🔑 Login</Link>
            <Link to="/register" className="btn btn-primary">📝 Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
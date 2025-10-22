import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Background Animation */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        zIndex: -1
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        width: '150px',
        height: '150px',
        background: 'linear-gradient(45deg, rgba(118, 75, 162, 0.1), rgba(102, 126, 234, 0.1))',
        borderRadius: '20px',
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: -1
      }}></div>

      <div className="card fade-in" style={{ 
        maxWidth: '450px', 
        width: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '16px',
            animation: 'bounce 2s infinite'
          }}>
            🔑
          </div>
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '8px'
          }}>
            Welcome Back
          </h2>
          <p style={{ color: '#718096', fontSize: '16px' }}>
            Sign in to access your escape room dashboard
          </p>
        </div>
        
        {error && (
          <div className="error-message fade-in">
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📧 Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid rgba(102, 126, 234, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>
          
          <div className="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid rgba(102, 126, 234, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading}
            style={{ 
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '700',
              background: isLoading 
                ? 'linear-gradient(135deg, #a0a0a0 0%, #808080 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isLoading ? (
              <>
                <div className="loading" style={{ marginRight: '8px' }}></div>
                Signing In...
              </>
            ) : (
              <>
                🚀 Sign In
              </>
            )}
          </button>
        </form>
        
        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '32px 0',
          color: '#a0aec0'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(160, 174, 192, 0.3)' }}></div>
          <span style={{ padding: '0 16px', fontSize: '14px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(160, 174, 192, 0.3)' }}></div>
        </div>
        
        {/* Register Link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#718096', marginBottom: '16px' }}>
            New to EscapeRoom Pro?
          </p>
          <Link 
            to="/register" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#667eea',
              fontWeight: '600',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            📝 Create Account
          </Link>
        </div>
        
        {/* Demo Credentials */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.1)'
        }}>
          <h4 style={{ 
            color: '#4a5568', 
            marginBottom: '12px', 
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            📝 Demo Credentials
          </h4>
          <p style={{ color: '#718096', fontSize: '13px', margin: '4px 0' }}>
            <strong>Admin:</strong> admin@escaperoom.com / admin123
          </p>
          <p style={{ color: '#718096', fontSize: '13px', margin: '4px 0' }}>
            <strong>User:</strong> user@example.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ 
    email: '', password: '', name: '', teamName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleNext = () => {
    if (step === 1 && formData.name && formData.email) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await register(formData.email, formData.password, formData.name, formData.teamName);
      navigate('/');
    } catch (error) {
      setError('Registration failed. Please try again.');
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
        top: '15%',
        right: '10%',
        width: '180px',
        height: '180px',
        background: 'linear-gradient(45deg, rgba(245, 101, 101, 0.1), rgba(229, 62, 62, 0.1))',
        borderRadius: '50%',
        animation: 'float 7s ease-in-out infinite',
        zIndex: -1
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '15%',
        width: '120px',
        height: '120px',
        background: 'linear-gradient(45deg, rgba(67, 233, 123, 0.1), rgba(56, 249, 215, 0.1))',
        borderRadius: '20px',
        animation: 'float 9s ease-in-out infinite reverse',
        zIndex: -1
      }}></div>

      <div className="card fade-in" style={{ 
        maxWidth: '500px', 
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
            🚀
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
            Join EscapeRoom Pro
          </h2>
          <p style={{ color: '#718096', fontSize: '16px' }}>
            Create your account and start your adventure
          </p>
        </div>

        {/* Progress Indicator */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '32px',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '4px',
            borderRadius: '2px',
            background: step >= 1 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}></div>
          <div style={{
            width: '40px',
            height: '4px',
            borderRadius: '2px',
            background: step >= 2 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}></div>
        </div>
        
        {error && (
          <div className="error-message fade-in">
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="fade-in">
              <h3 style={{ 
                color: '#4a5568', 
                marginBottom: '24px',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                👤 Personal Information
              </h3>
              
              <div className="form-group">
                <label>📝 Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid rgba(102, 126, 234, 0.1)'
                  }}
                />
              </div>
              
              <div className="form-group">
                <label>📧 Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid rgba(102, 126, 234, 0.1)'
                  }}
                />
              </div>
              
              <button 
                type="button"
                onClick={handleNext}
                disabled={!formData.name || !formData.email}
                className="btn btn-primary" 
                style={{ 
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '700',
                  opacity: (!formData.name || !formData.email) ? 0.5 : 1
                }}
              >
                Next Step →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <h3 style={{ 
                color: '#4a5568', 
                marginBottom: '24px',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                🔒 Security & Team
              </h3>
              
              <div className="form-group">
                <label>🔑 Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid rgba(102, 126, 234, 0.1)'
                  }}
                />
              </div>
              
              <div className="form-group">
                <label>👥 Team Name</label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  required
                  placeholder="Choose your team name"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid rgba(102, 126, 234, 0.1)'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button"
                  onClick={handleBack}
                  className="btn"
                  style={{ 
                    flex: '1',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    background: 'rgba(0, 0, 0, 0.1)',
                    color: '#4a5568'
                  }}
                >
                  ← Back
                </button>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn btn-primary" 
                  style={{ 
                    flex: '2',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: '700',
                    background: isLoading 
                      ? 'linear-gradient(135deg, #a0a0a0 0%, #808080 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="loading" style={{ marginRight: '8px' }}></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      🎉 Create Account
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
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
        
        {/* Login Link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#718096', marginBottom: '16px' }}>
            Already have an account?
          </p>
          <Link 
            to="/login" 
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
            🔑 Sign In Instead
          </Link>
        </div>
        
        {/* Features Preview */}
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
            ✨ What You'll Get
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <p style={{ color: '#718096', fontSize: '13px', margin: '0' }}>
              🎮 Interactive Puzzles
            </p>
            <p style={{ color: '#718096', fontSize: '13px', margin: '0' }}>
              👥 Team Management
            </p>
            <p style={{ color: '#718096', fontSize: '13px', margin: '0' }}>
              📊 Real-time Results
            </p>
            <p style={{ color: '#718096', fontSize: '13px', margin: '0' }}>
              🏆 Leaderboards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
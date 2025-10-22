import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = '#667eea', text = 'Loading...' }) => {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '20px'
    }}>
      <div style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: `3px solid rgba(102, 126, 234, 0.2)`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      {text && (
        <p style={{
          color: '#718096',
          fontSize: '14px',
          fontWeight: '500',
          margin: 0,
          animation: 'pulse 2s infinite'
        }}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
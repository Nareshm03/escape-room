import React from 'react';

const AnimatedBackground = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: -2,
      pointerEvents: 'none'
    }}>
      {/* Gradient Orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 20s ease-in-out infinite',
        animationDelay: '0s'
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 25s ease-in-out infinite reverse',
        animationDelay: '-5s'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(245, 101, 101, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 30s ease-in-out infinite',
        animationDelay: '-10s'
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '30%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(67, 233, 123, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 18s ease-in-out infinite reverse',
        animationDelay: '-15s'
      }}></div>
      
      {/* Geometric Shapes */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '5%',
        width: '60px',
        height: '60px',
        background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
        borderRadius: '12px',
        animation: 'rotate 40s linear infinite',
        animationDelay: '0s'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '30%',
        right: '5%',
        width: '80px',
        height: '80px',
        background: 'linear-gradient(45deg, rgba(245, 101, 101, 0.05), rgba(229, 62, 62, 0.05))',
        borderRadius: '50%',
        animation: 'rotate 35s linear infinite reverse',
        animationDelay: '-8s'
      }}></div>
      
      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: `rgba(102, 126, 234, ${0.1 + Math.random() * 0.1})`,
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `particle ${15 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
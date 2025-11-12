import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@escaperoom.com';

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</h1>
        <h2 style={{ marginBottom: '12px' }}>Access Denied</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
          You don't have permission to access this page.
        </p>
        <button 
          className="btn btn-primary" 
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default AdminRoute;

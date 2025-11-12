import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminRoute from '../components/AdminRoute';
import { AuthProvider } from '../utils/AuthContext';

const MockAuthProvider = ({ children, user }) => {
  const mockAuthContext = {
    user,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn()
  };

  return (
    <AuthProvider value={mockAuthContext}>
      {children}
    </AuthProvider>
  );
};

const TestComponent = () => <div>Admin Content</div>;

describe('AdminRoute', () => {
  test('should render children for admin user with role', () => {
    const adminUser = {
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin'
    };

    render(
      <BrowserRouter>
        <MockAuthProvider user={adminUser}>
          <AdminRoute>
            <TestComponent />
          </AdminRoute>
        </MockAuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  test('should render children for admin email fallback', () => {
    const adminUser = {
      name: 'Admin',
      email: 'admin@escaperoom.com',
      role: 'user'
    };

    render(
      <BrowserRouter>
        <MockAuthProvider user={adminUser}>
          <AdminRoute>
            <TestComponent />
          </AdminRoute>
        </MockAuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  test('should show access denied for non-admin user', () => {
    const regularUser = {
      name: 'User',
      email: 'user@example.com',
      role: 'user'
    };

    render(
      <BrowserRouter>
        <MockAuthProvider user={regularUser}>
          <AdminRoute>
            <TestComponent />
          </AdminRoute>
        </MockAuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText("You don't have permission to access this page.")).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('should redirect to login when user is not authenticated', () => {
    render(
      <BrowserRouter>
        <MockAuthProvider user={null}>
          <Routes>
            <Route path="/" element={
              <AdminRoute>
                <TestComponent />
              </AdminRoute>
            } />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MockAuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('access denied page should have go back button', () => {
    const regularUser = {
      name: 'User',
      email: 'user@example.com',
      role: 'user'
    };

    render(
      <BrowserRouter>
        <MockAuthProvider user={regularUser}>
          <AdminRoute>
            <TestComponent />
          </AdminRoute>
        </MockAuthProvider>
      </BrowserRouter>
    );

    const goBackButton = screen.getByText('Go Back');
    expect(goBackButton).toBeInTheDocument();
    expect(goBackButton).toHaveClass('btn', 'btn-primary');
  });
});

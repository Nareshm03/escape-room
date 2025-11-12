import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../utils/AuthContext';
import { SettingsProvider } from '../utils/SettingsContext';

const MockProviders = ({ children, user }) => {
  const mockAuthContext = {
    user,
    logout: jest.fn()
  };

  return (
    <BrowserRouter>
      <AuthProvider value={mockAuthContext}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Navbar - Admin Panel Link', () => {
  test('should not show admin panel link for non-admin users', () => {
    const regularUser = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    };

    render(
      <MockProviders user={regularUser}>
        <Navbar />
      </MockProviders>
    );

    const adminLink = screen.queryByTestId('admin-panel-link');
    expect(adminLink).not.toBeInTheDocument();
  });

  test('should show admin panel link for admin users (role-based)', () => {
    const adminUser = {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    };

    render(
      <MockProviders user={adminUser}>
        <Navbar />
      </MockProviders>
    );

    const adminLink = screen.getByTestId('admin-panel-link');
    expect(adminLink).toBeInTheDocument();
    expect(adminLink).toHaveTextContent('Admin Panel');
  });

  test('should show admin panel link for admin email fallback', () => {
    const adminUser = {
      name: 'Admin User',
      email: 'admin@escaperoom.com',
      role: 'user'
    };

    render(
      <MockProviders user={adminUser}>
        <Navbar />
      </MockProviders>
    );

    const adminLink = screen.getByTestId('admin-panel-link');
    expect(adminLink).toBeInTheDocument();
  });

  test('should not show admin panel link when user is not logged in', () => {
    render(
      <MockProviders user={null}>
        <Navbar />
      </MockProviders>
    );

    const adminLink = screen.queryByTestId('admin-panel-link');
    expect(adminLink).not.toBeInTheDocument();
  });

  test('admin panel link should have correct href', () => {
    const adminUser = {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    };

    render(
      <MockProviders user={adminUser}>
        <Navbar />
      </MockProviders>
    );

    const adminLink = screen.getByTestId('admin-panel-link');
    expect(adminLink).toHaveAttribute('href', '/admin');
  });

  test('admin panel link should have proper accessibility attributes', () => {
    const adminUser = {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    };

    render(
      <MockProviders user={adminUser}>
        <Navbar />
      </MockProviders>
    );

    const adminLink = screen.getByTestId('admin-panel-link');
    expect(adminLink).toHaveClass('nav-item');
    expect(adminLink.querySelector('.nav-icon')).toBeInTheDocument();
  });
});

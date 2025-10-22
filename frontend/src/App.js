import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import { SettingsProvider } from './utils/SettingsContext';
import Navbar from './components/Navbar';
import GlobalSecurity from './components/GlobalSecurity';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import GameDashboard from './pages/GameDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Results from './pages/Results';
import LiveLeaderboardPage from './pages/LiveLeaderboardPage';
import QuizCreator from './pages/QuizCreator';
import QuizTaker from './pages/QuizTaker';
import QuizList from './pages/QuizList';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
        <div className="App" style={{ position: 'relative', minHeight: '100vh' }}>
          <GlobalSecurity />
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/teams" element={
              <ProtectedRoute>
                <Teams />
              </ProtectedRoute>
            } />
            <Route path="/game" element={
              <ProtectedRoute>
                <GameDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } />
            <Route path="/live" element={
              <ProtectedRoute>
                <LiveLeaderboardPage />
              </ProtectedRoute>
            } />
            <Route path="/quiz-creator" element={
              <ProtectedRoute>
                <QuizCreator />
              </ProtectedRoute>
            } />
            <Route path="/quiz-list" element={
              <ProtectedRoute>
                <QuizList />
              </ProtectedRoute>
            } />
            <Route path="/quiz/:link" element={<QuizTaker />} />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
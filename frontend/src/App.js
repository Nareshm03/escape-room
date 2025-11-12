import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './utils/AuthContext';
import { SettingsProvider } from './utils/SettingsContext';
import { ToastProvider } from './utils/ToastContext';
import { ThemeProvider } from './components/ThemeProvider';
import GlassNavbar from './components/GlassNavbar';
import PageTransition from './components/PageTransition';
import GlobalSecurity from './components/GlobalSecurity';
import './styles/theme.css';
import ErrorBoundary from './components/ErrorBoundary';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import GameDashboard from './pages/GameDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Results from './pages/Results';
import LiveLeaderboardPage from './pages/LiveLeaderboardPage';
import QuizWizard3Step from './components/QuizWizard3Step';
import QuizTaker from './pages/QuizTaker';
import QuizList from './pages/QuizList';
import Settings from './pages/Settings';
import DesignSystem from './pages/DesignSystem';
import ComponentExample from './pages/ComponentExample';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import './styles/cinematic-background.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/teams" element={<ProtectedRoute><PageTransition><Teams /></PageTransition></ProtectedRoute>} />
        <Route path="/game" element={<ProtectedRoute><PageTransition><GameDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminRoute><PageTransition><AdminDashboard /></PageTransition></AdminRoute></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><PageTransition><Results /></PageTransition></ProtectedRoute>} />
        <Route path="/live" element={<ProtectedRoute><PageTransition><LiveLeaderboardPage /></PageTransition></ProtectedRoute>} />
        <Route path="/quiz-creator" element={<ProtectedRoute><PageTransition><QuizWizard3Step /></PageTransition></ProtectedRoute>} />
        <Route path="/quiz-list" element={<ProtectedRoute><PageTransition><QuizList /></PageTransition></ProtectedRoute>} />
        <Route path="/quiz/:link" element={<PageTransition><QuizTaker /></PageTransition>} />
        <Route path="/settings" element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />
        <Route path="/design-system" element={<ProtectedRoute><PageTransition><DesignSystem /></PageTransition></ProtectedRoute>} />
        <Route path="/component-example" element={<ProtectedRoute><PageTransition><ComponentExample /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SettingsProvider>
            <ToastProvider>
              <Router>
                <GlobalSecurity />
                <GlassNavbar />
                <main className="page-content">
                  <AnimatedRoutes />
                </main>
              </Router>
            </ToastProvider>
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
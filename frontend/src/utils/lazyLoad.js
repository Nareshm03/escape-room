import { lazy } from 'react';

// Lazy load heavy components
export const LazyAdminDashboard = lazy(() => import('../pages/AdminDashboard'));
export const LazyQuizCreator = lazy(() => import('../pages/QuizCreator'));
export const LazyQuizList = lazy(() => import('../pages/QuizList'));
export const LazyResults = lazy(() => import('../pages/Results'));
export const LazyLiveLeaderboard = lazy(() => import('../pages/LiveLeaderboardPage'));
export const LazyDesignSystem = lazy(() => import('../pages/DesignSystem'));
export const LazyComponentExample = lazy(() => import('../pages/ComponentExample'));

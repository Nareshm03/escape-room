import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    quizName: 'Escape Room Challenge',
    showQuizName: true,
    showPageTitles: true,
    showProgressBar: true,
    showPageNumberBar: false,
    showLogo: false,
    timeLimit: 30,
    hasTimeLimit: true,
    pageTimeLimits: true,
    defaultPageTimeLimit: 120,
    randomizeQuestions: false,
    randomizeAll: true,
    autoNumberQuestions: true,
    questionBookmarks: false,
    questionsPerPage: 1,
    maxQuizAttempts: 3,
    canOnlyRetakeIfFail: false,
    useBrowserAttemptsTracker: true,
    redirectOnCompletion: false,
    redirectUrl: '',
    hasSchedule: false,
    scheduleFrom: '',
    scheduleTo: '',
    userSchedule: false,
    userScheduleDays: 7,
    questionLayout: 'vertical',
    navigationBarPosition: 'fixed',
    allowCut: false,
    allowCopy: false,
    allowPaste: false,
    allowRightClick: false,
    allowPrint: false,
    allowPreviousPageNavigation: true,
    confirmBeforeSubmit: true,
    confirmBeforeCloseBrowser: true
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/api/settings');
      if (response.data && Object.keys(response.data).length > 0) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.log('Using default settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      await api.post('/api/settings', newSettings);
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error('Failed to update settings:', error);
      return false;
    }
  };

  const value = {
    settings,
    setSettings,
    updateSettings,
    loading,
    fetchSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
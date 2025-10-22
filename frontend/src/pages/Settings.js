import React, { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../utils/SettingsContext';

const Settings = () => {
  const { settings, setSettings, updateSettings } = useSettings();

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // eslint-disable-next-line no-use-before-define
  useEffect(() => {
    const cleanup = applySecuritySettings();
    return cleanup;
  }, [applySecuritySettings]);



  const saveSettings = async () => {
    try {
      setLoading(true);
      const success = await updateSettings(settings);
      if (success) {
        setMessage('✅ Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to save settings');
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      setMessage('❌ Failed to save settings: ' + error.message);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (!settings.allowCut && (e.ctrlKey && e.key === 'x')) e.preventDefault();
    if (!settings.allowCopy && (e.ctrlKey && e.key === 'c')) e.preventDefault();
    if (!settings.allowPaste && (e.ctrlKey && e.key === 'v')) e.preventDefault();
    if (!settings.allowPrint && (e.ctrlKey && e.key === 'p')) e.preventDefault();
  }, [settings.allowCut, settings.allowCopy, settings.allowPaste, settings.allowPrint]);

  const handleContextMenu = useCallback((e) => {
    if (!settings.allowRightClick) e.preventDefault();
  }, [settings.allowRightClick]);

  const handleBeforeUnload = useCallback((e) => {
    e.preventDefault();
    e.returnValue = '';
  }, []);

  const applySecuritySettings = useCallback(() => {
    // Clean up existing listeners
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    
    // Apply new settings
    if (!settings.allowCut || !settings.allowCopy || !settings.allowPaste || !settings.allowPrint) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    if (!settings.allowRightClick) {
      document.addEventListener('contextmenu', handleContextMenu);
    }
    
    if (settings.confirmBeforeCloseBrowser) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [settings.allowCut, settings.allowCopy, settings.allowPaste, settings.allowRightClick, settings.allowPrint, settings.confirmBeforeCloseBrowser, handleKeyDown, handleContextMenu, handleBeforeUnload]);



  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const renderGeneral = () => (
    <div>
      <h3 style={{ color: '#4a5568', marginBottom: '20px' }}>🎯 General Settings</h3>
      <div className="form-group">
        <label>Application Name</label>
        <input
          type="text"
          value={settings.quizName}
          onChange={(e) => handleChange('quizName', e.target.value)}
          placeholder="Enter application name"
        />
        <small>This name will appear throughout the application</small>
      </div>
    </div>
  );

  const renderDisplay = () => (
    <div>
      <h3 style={{ color: '#4a5568', marginBottom: '20px' }}>🎨 Display Settings</h3>
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={settings.showQuizName}
            onChange={(e) => handleChange('showQuizName', e.target.checked)}
          />
          Show Application Name in Header
        </label>
        <small>Display the application name in the navigation bar</small>
      </div>
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={settings.showPageTitles}
            onChange={(e) => handleChange('showPageTitles', e.target.checked)}
          />
          Show Page Titles
        </label>
        <small>Display titles on each page</small>
      </div>
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={settings.showProgressBar}
            onChange={(e) => handleChange('showProgressBar', e.target.checked)}
          />
          Show Progress Bar
        </label>
        <small>Display progress indicators during quizzes</small>
      </div>
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={settings.showPageNumberBar}
            onChange={(e) => handleChange('showPageNumberBar', e.target.checked)}
          />
          Show Page Numbers
        </label>
        <small>Display page numbers in multi-page quizzes</small>
      </div>
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={settings.showLogo}
            onChange={(e) => handleChange('showLogo', e.target.checked)}
          />
          Show Logo
        </label>
        <small>Display company/organization logo</small>
      </div>
    </div>
  );

  const renderTimeSettings = () => (
    <div>
      <h3 style={{ color: '#4a5568', marginBottom: '20px' }}>⏰ Time Settings</h3>
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={settings.hasTimeLimit}
            onChange={(e) => handleChange('hasTimeLimit', e.target.checked)}
          />
          Enable Global Time Limit
        </label>
        <small>Set a time limit for the entire quiz/game session</small>
      </div>
      {settings.hasTimeLimit && (
        <div className="form-group">
          <label>Global Time Limit (minutes)</label>
          <input
            type="number"
            value={settings.timeLimit}
            onChange={(e) => handleChange('timeLimit', parseInt(e.target.value) || 30)}
            min="1"
            max="180"
          />
          <small>Users will have this amount of time to complete the entire session</small>
        </div>
      )}
      
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={settings.pageTimeLimits}
            onChange={(e) => handleChange('pageTimeLimits', e.target.checked)}
          />
          Enable Individual Question Time Limits
        </label>
        <small>Set time limits for individual questions or stages</small>
      </div>
      {settings.pageTimeLimits && (
        <div className="form-group">
          <label>Default Question Time Limit (seconds)</label>
          <input
            type="number"
            value={settings.defaultPageTimeLimit}
            onChange={(e) => handleChange('defaultPageTimeLimit', parseInt(e.target.value) || 120)}
            min="10"
            max="600"
          />
          <small>Default time limit for each question (can be overridden per question)</small>
        </div>
      )}
    </div>
  );

  const renderQuestionSettings = () => (
    <div>
      <h3>Question Settings</h3>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={settings.randomizeQuestions}
            onChange={(e) => handleChange('randomizeQuestions', e.target.checked)}
          />
          Randomize Questions
        </label>
      </div>
      {settings.randomizeQuestions && (
        <div className="form-group">
          <label>
            <input
              type="radio"
              name="randomizeType"
              checked={settings.randomizeAll}
              onChange={() => handleChange('randomizeAll', true)}
            />
            Randomize All Questions
          </label>
          <label>
            <input
              type="radio"
              name="randomizeType"
              checked={!settings.randomizeAll}
              onChange={() => handleChange('randomizeAll', false)}
            />
            Include Specific Number of Questions
          </label>
        </div>
      )}
      
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={settings.autoNumberQuestions}
            onChange={(e) => handleChange('autoNumberQuestions', e.target.checked)}
          />
          Auto Number Questions
        </label>
        <small>A sequential number will be automatically added to the start of each question</small>
      </div>
      
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={settings.questionBookmarks}
            onChange={(e) => handleChange('questionBookmarks', e.target.checked)}
          />
          Question Bookmarks
        </label>
        <small>Respondents can bookmark questions during the test</small>
      </div>
      
      <div className="form-group">
        <label>Questions Per Page</label>
        <input
          type="number"
          value={settings.questionsPerPage}
          onChange={(e) => handleChange('questionsPerPage', parseInt(e.target.value))}
          min="1"
        />
        <small>If selected this will override the page setup on the Create screen</small>
      </div>
    </div>
  );

  const renderAttempts = () => (
    <div>
      <h3>Quiz Attempts</h3>
      <div className="form-group">
        <label>Maximum Quiz Attempts</label>
        <input
          type="number"
          value={settings.maxQuizAttempts}
          onChange={(e) => handleChange('maxQuizAttempts', parseInt(e.target.value))}
          min="1"
        />
        <small>If set to greater than 1 then respondents will be able take the quiz up to this value set</small>
      </div>
      
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={settings.canOnlyRetakeIfFail}
            onChange={(e) => handleChange('canOnlyRetakeIfFail', e.target.checked)}
          />
          Can Only Retake if Fail Quiz
        </label>
      </div>
      
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={settings.useBrowserAttemptsTracker}
            onChange={(e) => handleChange('useBrowserAttemptsTracker', e.target.checked)}
          />
          Use Browser Attempts Tracker
        </label>
        <small>A respondent will only be able to complete your quiz the specified number of times from the same device/browser</small>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div>
      <h3>Schedule Settings</h3>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={settings.hasSchedule}
            onChange={(e) => handleChange('hasSchedule', e.target.checked)}
          />
          Enable Schedule
        </label>
      </div>
      {settings.hasSchedule && (
        <>
          <div className="form-group">
            <label>From Date & Time</label>
            <input
              type="datetime-local"
              value={settings.scheduleFrom}
              onChange={(e) => handleChange('scheduleFrom', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>To Date & Time</label>
            <input
              type="datetime-local"
              value={settings.scheduleTo}
              onChange={(e) => handleChange('scheduleTo', e.target.value)}
            />
          </div>
        </>
      )}
      
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={settings.userSchedule}
            onChange={(e) => handleChange('userSchedule', e.target.checked)}
          />
          User Schedule
        </label>
      </div>
      {settings.userSchedule && (
        <div className="form-group">
          <label>User Schedule Days</label>
          <input
            type="number"
            value={settings.userScheduleDays}
            onChange={(e) => handleChange('userScheduleDays', parseInt(e.target.value))}
            min="1"
          />
          <small>Set the number of days that each user can access the quiz</small>
        </div>
      )}
    </div>
  );

  const renderLayout = () => (
    <div>
      <h3>Layout Settings</h3>
      <div className="form-group">
        <label>Question Layout</label>
        <select
          value={settings.questionLayout}
          onChange={(e) => handleChange('questionLayout', e.target.value)}
        >
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
        <small>Options can be positioned under the question text (Vertical) or to the right of the question text (Horizontal)</small>
      </div>
      
      <div className="form-group">
        <label>Navigation Bar Position</label>
        <select
          value={settings.navigationBarPosition}
          onChange={(e) => handleChange('navigationBarPosition', e.target.value)}
        >
          <option value="fixed">Fixed</option>
          <option value="bottom">Bottom</option>
          <option value="top">Top</option>
        </select>
        <small>The navigation buttons can be positioned to display at the end of the page (inline) or fixed to the bottom of the screen (Fixed)</small>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div>
      <h3 style={{ color: '#4a5568', marginBottom: '20px' }}>🔒 Security Settings</h3>
      <div className="form-group">
        <label style={{ fontWeight: '600', marginBottom: '12px', display: 'block' }}>Browser Restrictions</label>
        <div style={{ marginLeft: '20px', display: 'grid', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.allowCut}
              onChange={(e) => handleChange('allowCut', e.target.checked)}
            />
            Allow Cut (Ctrl+X)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.allowCopy}
              onChange={(e) => handleChange('allowCopy', e.target.checked)}
            />
            Allow Copy (Ctrl+C)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.allowPaste}
              onChange={(e) => handleChange('allowPaste', e.target.checked)}
            />
            Allow Paste (Ctrl+V)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.allowRightClick}
              onChange={(e) => handleChange('allowRightClick', e.target.checked)}
            />
            Allow Right Click Context Menu
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={settings.allowPrint}
              onChange={(e) => handleChange('allowPrint', e.target.checked)}
            />
            Allow Print (Ctrl+P)
          </label>
        </div>
        <small>Disable these options to prevent cheating during quizzes</small>
      </div>
      
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={settings.allowPreviousPageNavigation}
            onChange={(e) => handleChange('allowPreviousPageNavigation', e.target.checked)}
          />
          Allow Previous Page Navigation
        </label>
        <small>Allow users to go back to previous questions/pages</small>
      </div>
      
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={settings.useBrowserAttemptsTracker}
            onChange={(e) => handleChange('useBrowserAttemptsTracker', e.target.checked)}
          />
          Track Attempts by Browser
        </label>
        <small>Limit quiz attempts per browser/device</small>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div>
      <h3 style={{ color: '#4a5568', marginBottom: '20px' }}>✅ Confirmation Settings</h3>
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={settings.confirmBeforeSubmit}
            onChange={(e) => handleChange('confirmBeforeSubmit', e.target.checked)}
          />
          Confirm Before Submit
        </label>
        <small>Show confirmation dialog before submitting answers</small>
      </div>
      
      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={settings.confirmBeforeCloseBrowser}
            onChange={(e) => handleChange('confirmBeforeCloseBrowser', e.target.checked)}
          />
          Warn Before Closing Browser
        </label>
        <small>Show warning when user tries to close browser tab during quiz</small>
      </div>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General', component: renderGeneral },
    { id: 'display', label: 'Display', component: renderDisplay },
    { id: 'time', label: 'Time Settings', component: renderTimeSettings },
    { id: 'questions', label: 'Questions', component: renderQuestionSettings },
    { id: 'attempts', label: 'Attempts', component: renderAttempts },
    { id: 'schedule', label: 'Schedule', component: renderSchedule },
    { id: 'layout', label: 'Layout', component: renderLayout },
    { id: 'security', label: 'Security', component: renderSecurity },
    { id: 'confirmation', label: 'Confirmation', component: renderConfirmation }
  ];

  return (
    <div className="container">
      <div className="slide-in-left" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '12px'
        }}>
          ⚙️ Application Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Configure your application preferences and behavior</p>
      </div>
      
      {message && (
        <div className={`${message.includes('success') ? 'success' : 'error-message'} scale-in`}>
          {message}
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar */}
        <div className="slide-in-left" style={{ width: '280px' }}>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h3 style={{ 
              marginBottom: '24px', 
              color: '#374151',
              fontSize: '18px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📋 Settings Menu
            </h3>
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className="fade-in"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  padding: '14px 18px',
                  cursor: 'pointer',
                  background: activeTab === tab.id 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                    : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#4b5563',
                  borderRadius: '12px',
                  marginBottom: '6px',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  border: activeTab === tab.id ? 'none' : '1px solid transparent'
                }}
                onClick={() => setActiveTab(tab.id)}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = '#f8fafc';
                    e.target.style.borderColor = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = 'transparent';
                  }
                }}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="slide-in-right" style={{ flex: 1 }}>
          <div className="card">
            <div style={{ minHeight: '400px' }}>
              {tabs.find(tab => tab.id === activeTab)?.component()}
            </div>
            
            <div style={{ 
              marginTop: '40px', 
              paddingTop: '24px', 
              borderTop: '2px solid #f1f5f9',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <button 
                onClick={saveSettings} 
                className="btn btn-primary"
                disabled={loading}
                style={{ 
                  minWidth: '160px',
                  background: loading 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #667eea, #764ba2)'
                }}
              >
                {loading ? '💾 Saving...' : '💾 Save Settings'}
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="btn"
                style={{ 
                  background: '#f3f4f6', 
                  color: '#4b5563',
                  minWidth: '120px',
                  border: '1px solid #e5e7eb'
                }}
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
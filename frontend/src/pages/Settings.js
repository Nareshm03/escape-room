import React, { useState } from 'react';
import { useSettings } from '../utils/SettingsContext';
import { useToast } from '../utils/ToastContext';
import { useSystemStatus } from '../hooks/useSystemStatus';
import StatusIndicator from '../components/StatusIndicator';
import '../styles/Settings.css';

const Settings = () => {
  const { settings, setSettings, updateSettings } = useSettings();
  const { success, error, warning } = useToast();
  const { status, refreshStatus } = useSystemStatus();

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const saveSettings = async () => {
    try {
      setLoading(true);
      const result = await updateSettings(settings);
      if (result) {
        success('Settings saved successfully!');
        setHasUnsavedChanges(false);
      } else {
        error('Failed to save settings');
      }
    } catch (err) {
      error('Failed to save settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
    setHasUnsavedChanges(true);
  };

  const resetSettings = () => {
    if (hasUnsavedChanges) {
      warning('Unsaved changes will be lost');
    }
    window.location.reload();
  };

  const renderGeneral = () => (
    <div>
      <h3 className="settings-section-title">🎯 General Settings</h3>
      
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

      <div className="form-group">
        <label className="checkbox-label">
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
        <label className="checkbox-label">
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
        <label className="checkbox-label">
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
        <label className="checkbox-label">
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
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.showLogo}
            onChange={(e) => handleChange('showLogo', e.target.checked)}
          />
          Show Logo
        </label>
        <small>Display company/organization logo</small>
      </div>

      <div className="form-group">
        <label>Question Layout</label>
        <select
          value={settings.questionLayout}
          onChange={(e) => handleChange('questionLayout', e.target.value)}
        >
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
        <small>Options can be positioned under the question text (Vertical) or to the right (Horizontal)</small>
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
        <small>Position of navigation buttons on the page</small>
      </div>
    </div>
  );

  const renderEvent = () => (
    <div>
      <h3 className="settings-section-title">⏰ Event Settings</h3>
      
      <div className="form-group">
        <label className="checkbox-label">
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
        <label className="checkbox-label">
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

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.hasSchedule}
            onChange={(e) => handleChange('hasSchedule', e.target.checked)}
          />
          Enable Schedule
        </label>
        <small>Set start and end dates for the event</small>
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
        <label>Maximum Quiz Attempts</label>
        <input
          type="number"
          value={settings.maxQuizAttempts}
          onChange={(e) => handleChange('maxQuizAttempts', parseInt(e.target.value))}
          min="1"
        />
        <small>Number of times a user can attempt the quiz</small>
      </div>
      
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.canOnlyRetakeIfFail}
            onChange={(e) => handleChange('canOnlyRetakeIfFail', e.target.checked)}
          />
          Can Only Retake if Fail Quiz
        </label>
        <small>Users can only retry if they fail</small>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.randomizeQuestions}
            onChange={(e) => handleChange('randomizeQuestions', e.target.checked)}
          />
          Randomize Questions
        </label>
        <small>Shuffle question order for each attempt</small>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.autoNumberQuestions}
            onChange={(e) => handleChange('autoNumberQuestions', e.target.checked)}
          />
          Auto Number Questions
        </label>
        <small>Automatically add sequential numbers to questions</small>
      </div>

      <div className="form-group">
        <label>Questions Per Page</label>
        <input
          type="number"
          value={settings.questionsPerPage}
          onChange={(e) => handleChange('questionsPerPage', parseInt(e.target.value))}
          min="1"
        />
        <small>Number of questions to display per page</small>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div>
      <h3 className="settings-section-title">🔒 Security Settings</h3>
      
      <div className="form-group">
        <label style={{ fontWeight: '600', marginBottom: '12px', display: 'block' }}>Browser Restrictions</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.allowCut}
              onChange={(e) => handleChange('allowCut', e.target.checked)}
            />
            Allow Cut (Ctrl+X)
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.allowCopy}
              onChange={(e) => handleChange('allowCopy', e.target.checked)}
            />
            Allow Copy (Ctrl+C)
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.allowPaste}
              onChange={(e) => handleChange('allowPaste', e.target.checked)}
            />
            Allow Paste (Ctrl+V)
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.allowRightClick}
              onChange={(e) => handleChange('allowRightClick', e.target.checked)}
            />
            Allow Right Click Context Menu
          </label>
          <label className="checkbox-label">
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
        <label className="checkbox-label">
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
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.useBrowserAttemptsTracker}
            onChange={(e) => handleChange('useBrowserAttemptsTracker', e.target.checked)}
          />
          Track Attempts by Browser
        </label>
        <small>Limit quiz attempts per browser/device</small>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
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
        <label className="checkbox-label">
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
    { id: 'general', label: 'General', icon: '🎯', component: renderGeneral },
    { id: 'event', label: 'Event Settings', icon: '⏰', component: renderEvent },
    { id: 'security', label: 'Security', icon: '🔒', component: renderSecurity }
  ];

  return (
    <div className="settings-container light-card">
      <div className="settings-header slide-in-left light-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <h1 className="settings-title">⚙️ Application Settings</h1>
          <StatusIndicator
            icon="🕒"
            label="Time Limit"
            value={status.timeLimit.value}
            status={status.timeLimit.status}
            lastUpdated={status.timeLimit.lastUpdated}
            onQuickAction={() => setActiveTab('event')}
          />
          <StatusIndicator
            icon="🔐"
            label="Anti-Cheat"
            value={status.antiCheat.value}
            status={status.antiCheat.status}
            lastUpdated={status.antiCheat.lastUpdated}
            onQuickAction={() => setActiveTab('security')}
          />
          <StatusIndicator
            icon="🧠"
            label="SEB Mode"
            value={status.sebMode.value}
            status={status.sebMode.status}
            lastUpdated={status.sebMode.lastUpdated}
          />
        </div>
        <p className="settings-subtitle">Configure your application preferences and behavior</p>
      </div>
      
      <div className="settings-layout">
        <div className="settings-sidebar slide-in-left">
          <div className="settings-menu">
            <h3 className="settings-menu-title">📋 Settings Menu</h3>
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''} fade-in`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </div>
            ))}
          </div>
        </div>
        
        <div className="settings-content slide-in-right light-card">
          <div className="settings-panel light-card">
            <div style={{ minHeight: '400px' }}>
              {tabs.find(tab => tab.id === activeTab)?.component()}
            </div>
            
            <div className="settings-actions">
              <button 
                onClick={saveSettings} 
                className="btn-save"
                disabled={loading}
              >
                {loading ? '💾 Saving...' : '💾 Save Settings'}
              </button>
              <button 
                onClick={resetSettings} 
                className="btn-reset"
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

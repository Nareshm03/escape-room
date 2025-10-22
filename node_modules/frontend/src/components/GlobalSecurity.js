import { useEffect } from 'react';
import { useSettings } from '../utils/SettingsContext';

const GlobalSecurity = () => {
  const { settings } = useSettings();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!settings.allowCut && (e.ctrlKey && e.key === 'x')) e.preventDefault();
      if (!settings.allowCopy && (e.ctrlKey && e.key === 'c')) e.preventDefault();
      if (!settings.allowPaste && (e.ctrlKey && e.key === 'v')) e.preventDefault();
      if (!settings.allowPrint && (e.ctrlKey && e.key === 'p')) e.preventDefault();
    };

    const handleContextMenu = (e) => {
      if (!settings.allowRightClick) e.preventDefault();
    };

    const handleBeforeUnload = (e) => {
      if (settings.confirmBeforeCloseBrowser) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [settings]);

  return null;
};

export default GlobalSecurity;
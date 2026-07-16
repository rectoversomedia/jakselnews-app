'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface NotificationSettings {
  breakingNews: {
    push: boolean;
    email: boolean;
  };
  localNews: {
    push: boolean;
    email: boolean;
  };
  comments: {
    push: boolean;
    email: boolean;
  };
  weekly: {
    push: boolean;
    email: boolean;
  };
}

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  toggleNotification: (category: keyof NotificationSettings, channel: 'push' | 'email') => void;
  requestPermission: () => Promise<boolean>;
  hasPermission: boolean;
}

const defaultSettings: NotificationSettings = {
  breakingNews: { push: true, email: true },
  localNews: { push: true, email: false },
  comments: { push: true, email: false },
  weekly: { push: false, email: true },
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [hasPermission, setHasPermission] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load saved settings
    const saved = localStorage.getItem('jakselnews-notif-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse notification settings');
      }
    }

    // Check permission status
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('jakselnews-notif-settings', JSON.stringify(settings));
    }
  }, [settings, mounted]);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleNotification = (category: keyof NotificationSettings, channel: 'push' | 'email') => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !prev[category][channel],
      },
    }));
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    setHasPermission(granted);
    return granted;
  };

  return (
    <NotificationContext.Provider value={{ settings, updateSettings, toggleNotification, requestPermission, hasPermission }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

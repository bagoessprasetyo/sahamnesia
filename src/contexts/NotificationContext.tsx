import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AdminNotification } from '@/types/admin';

interface NotificationContextType {
  notifications: AdminNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AdminNotification, 'id' | 'created_at'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
  adminId?: string;
}

export function NotificationProvider({ children, adminId }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  const loadNotifications = useCallback(async () => {
    try {
      // Mock API call - In real implementation, this would fetch from server
      const mockNotifications: AdminNotification[] = [
        {
          id: '1',
          type: 'info',
          title: 'Welcome to the new CMS',
          message: 'We\'ve updated our content management system with new features.',
          action_url: '/admin/analytics',
          action_text: 'View Analytics',
          is_read: false,
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
        },
        {
          id: '2',
          type: 'success',
          title: 'Blog post published',
          message: 'Your blog post "Trading Strategy for Beginners" has been published.',
          action_url: '/admin/blog/posts',
          action_text: 'View Post',
          is_read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        {
          id: '3',
          type: 'warning',
          title: 'Scheduled maintenance',
          message: 'System maintenance scheduled for tonight 11 PM - 2 AM.',
          is_read: true,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        },
        {
          id: '4',
          type: 'error',
          title: 'Failed media upload',
          message: 'There was an issue uploading your media file.',
          action_url: '/admin/media',
          action_text: 'Try Again',
          is_read: true,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, []);

  // Load initial notifications
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const addNotification = useCallback((notificationData: Omit<AdminNotification, 'id' | 'created_at'>) => {
    const newNotification: AdminNotification = {
      ...notificationData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, is_read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, is_read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const refreshNotifications = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
}

// Hook for creating notifications with common patterns
export function useNotificationHelpers() {
  const { addNotification } = useNotifications();

  const notifySuccess = useCallback((title: string, message: string, actionUrl?: string, actionText?: string) => {
    addNotification({
      type: 'success',
      title,
      message,
      action_url: actionUrl,
      action_text: actionText,
      is_read: false
    });
  }, [addNotification]);

  const notifyError = useCallback((title: string, message: string, actionUrl?: string, actionText?: string) => {
    addNotification({
      type: 'error',
      title,
      message,
      action_url: actionUrl,
      action_text: actionText,
      is_read: false
    });
  }, [addNotification]);

  const notifyWarning = useCallback((title: string, message: string, actionUrl?: string, actionText?: string) => {
    addNotification({
      type: 'warning',
      title,
      message,
      action_url: actionUrl,
      action_text: actionText,
      is_read: false
    });
  }, [addNotification]);

  const notifyInfo = useCallback((title: string, message: string, actionUrl?: string, actionText?: string) => {
    addNotification({
      type: 'info',
      title,
      message,
      action_url: actionUrl,
      action_text: actionText,
      is_read: false
    });
  }, [addNotification]);

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo
  };
}
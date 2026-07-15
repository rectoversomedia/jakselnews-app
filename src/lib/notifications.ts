// Push Notification Service
// Handles FCM token management and notification permissions

import { firebaseConfig, isFCMConfigured } from './firebase';

const FCM_TOKEN_KEY = 'fcm_token';
const FCM_PERMISSION_KEY = 'notification_permission';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, string>;
  url?: string;
}

class NotificationService {
  private fcmToken: string | null = null;
  private swRegistration: ServiceWorkerRegistration | null = null;

  /**
   * Check if push notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /**
   * Check if notification permission is granted
   */
  isPermissionGranted(): boolean {
    return Notification.permission === 'granted';
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('Push notifications not supported');
      return 'denied';
    }

    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      localStorage.setItem(FCM_PERMISSION_KEY, 'granted');
      await this.registerServiceWorker();
      await this.subscribeToPush();
    }

    return permission;
  }

  /**
   * Register service worker for push notifications
   */
  private async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) return;

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      // Listen for token refresh
      this.swRegistration.addEventListener('updatefound', () => {
        const newWorker = this.swRegistration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('New service worker available');
            }
          });
        }
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }

  /**
   * Subscribe to FCM push notifications
   */
  private async subscribeToPush(): Promise<void> {
    if (!this.swRegistration || !isFCMConfigured()) {
      console.warn('Cannot subscribe to push: service worker or FCM not configured');
      return;
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(firebaseConfig.messagingSenderId),
      });

      // Extract FCM token from subscription
      const token = btoa(JSON.stringify(subscription));
      this.fcmToken = token;
      localStorage.setItem(FCM_TOKEN_KEY, token);

      // Send token to server for storage
      await this.sendTokenToServer(token);
    } catch (error) {
      console.error('Push subscription failed:', error);
    }
  }

  /**
   * Send FCM token to server for storage
   */
  private async sendTokenToServer(token: string): Promise<void> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      const response = await fetch(`${apiUrl}/notifications/register-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify({ token, platform: 'web' }),
      });

      if (!response.ok) {
        throw new Error('Failed to register token');
      }
    } catch (error) {
      console.error('Failed to send token to server:', error);
    }
  }

  /**
   * Show local notification (when app is in foreground)
   */
  async showNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isPermissionGranted()) {
      console.warn('Notification permission not granted');
      return;
    }

    // If service worker registration exists, use it for foreground notifications
    if (this.swRegistration) {
      this.swRegistration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/logo-button.png',
        badge: payload.badge || '/placeholder.jpg',
        tag: payload.tag || 'default',
        data: payload.data,
        data: {
          ...payload.data,
          url: payload.url,
        },
      });
    } else {
      // Fallback to basic Notification API
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/logo-button.png',
        tag: payload.tag,
      });
    }
  }

  /**
   * Handle notification click
   */
  handleNotificationClick(callback: (url: string) => void): void {
    if (!navigator.serviceWorker) return;

    navigator.serviceWorker.addEventListener('notificationclick', (event) => {
      event.notification.close();

      const url = event.notification.data?.url || '/';

      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
          // Focus existing window if available
          for (const client of clientList) {
            if (client.url === url && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
      );

      callback(url);
    });
  }

  /**
   * Get stored FCM token
   */
  getToken(): string | null {
    if (this.fcmToken) return this.fcmToken;
    return localStorage.getItem(FCM_TOKEN_KEY);
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<void> {
    if (!this.swRegistration) return;

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }

      // Remove token from server
      const token = this.getToken();
      if (token) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        await fetch(`${apiUrl}/notifications/unregister-token`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
          },
          body: JSON.stringify({ token }),
        });
      }

      localStorage.removeItem(FCM_TOKEN_KEY);
      localStorage.removeItem(FCM_PERMISSION_KEY);
      this.fcmToken = null;
    } catch (error) {
      console.error('Unsubscribe failed:', error);
    }
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

export const notificationService = new NotificationService();

// lib/notificationClient.js
// Enhanced WebSocket notification client for Astro application

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

class AstroWebNotificationClient {
  constructor(options = {}) {
    // Environment-aware WebSocket URL
    const isDev = import.meta.env.DEV;
    const wsProtocol = isDev ? 'ws' : 'wss';
    const wsHost = isDev ? 'localhost:3000' : 'backend.yoyoite.com';
    
    this.wsUrl = options.wsUrl || `${wsProtocol}://${wsHost}/ws/notifications`;
    this.reconnectInterval = options.reconnectInterval || 5000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.reconnectAttempts = 0;
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.authToken = options.authToken || null;
    this.isInitialized = false;
    
    // Astro-specific properties
    this.notificationCount = 0;
    
    this.init();
  }

  init() {
    // Only initialize once per page
    if (this.isInitialized) return;
    this.isInitialized = true;
    
    this.requestNotificationPermission();
    this.connect();
    this.setupAstroIntegration();
  }

  setupAstroIntegration() {
    // Listen for Astro view transitions to maintain connection
    document.addEventListener('astro:before-preparation', () => {
      // Don't close connection during navigation
      console.log('Astro navigation starting...');
    });

    document.addEventListener('astro:after-swap', () => {
      // Reinitialize UI elements after page swap
      this.reinitializeUI();
    });

    document.addEventListener('astro:page-load', () => {
      // Ensure connection is active after page load
      if (!this.isConnected) {
        this.connect();
      }
    });
  }

  reinitializeUI() {
    // Update notification badge after view transition
    this.updateNotificationBadge(this.notificationCount);
    
    // Re-attach event listeners to new DOM elements
    const notificationList = document.getElementById('notification-list');
    if (notificationList) {
      // Clear and rebuild notification list if needed
      this.rebuildNotificationList();
    }
  }

  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  connect() {
    try {
      // Get fresh auth token
      const token = this.authToken || getCookie('accessToken');
      
      const wsUrl = token 
        ? `${this.wsUrl}?token=${token}`
        : this.wsUrl;
        
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('🔔 Connected to notification service');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connected');
        
        // Send user identification
        this.identifyUser();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing notification message:', error);
        }
      };

      this.socket.onclose = (event) => {
        console.log('🔔 Disconnected from notification service', event.code);
        this.isConnected = false;
        this.emit('disconnected', event);
        
        // Only reconnect if not a normal closure
        if (event.code !== 1000) {
          this.reconnect();
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };

    } catch (error) {
      console.error('Error connecting to notification service:', error);
      this.reconnect();
    }
  }

  identifyUser() {
    if (this.isConnected) {
      const userInfo = this.getCurrentUser();
      this.socket.send(JSON.stringify({
        type: 'identify',
        data: {
          userId: userInfo?.id,
          role: userInfo?.role,
          timestamp: Date.now()
        }
      }));
    }
  }

  getCurrentUser() {
    // Try to get user info from various sources
    try {
      // From global window object (if set by Astro)
      if (window.currentUser) {
        return window.currentUser;
      }
      
      // From localStorage
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        return JSON.parse(userStr);
      }
      
      // From meta tag (if you add it to your layout)
      const userMeta = document.querySelector('meta[name="current-user"]');
      if (userMeta) {
        return JSON.parse(userMeta.content);
      }
      
    } catch (error) {
      console.error('Error getting current user:', error);
    }
    
    return null;
  }

  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('max_reconnect_attempts');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval * this.reconnectAttempts); // Exponential backoff
  }

  handleMessage(data) {
    console.log('📨 Received message:', data);
    
    switch (data.type) {
      case 'notification':
        this.handleNotification(data.data);
        break;
      case 'browser_notification':
        this.showBrowserNotification(data.data);
        break;
      case 'connected':
        this.emit('connected', data);
        break;
      case 'pong':
        this.emit('pong', data);
        break;
      case 'notification_read':
        this.handleNotificationRead(data);
        break;
      case 'notification_count':
        this.updateNotificationBadge(data.count);
        break;
      case 'error':
        console.error('Server error:', data);
        this.emit('error', data);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  handleNotification(notification) {
    console.log('🔔 New notification:', notification);
    
    // Increment local counter
    this.notificationCount++;
    
    // Update UI
    this.updateNotificationUI(notification);
    
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      this.showBrowserNotification({
        title: notification.title,
        body: notification.message,
        icon: this.getIconForType(notification.type),
        data: notification
      });
    }

    // Play notification sound (optional)
    this.playNotificationSound();

    this.emit('notification', notification);
  }

  handleNotificationRead(data) {
    // Update UI to mark notification as read
    const notificationElement = document.querySelector(`[data-notification-id="${data.notificationId}"]`);
    if (notificationElement) {
      notificationElement.classList.add('read');
    }
    
    // Decrease counter
    this.notificationCount = Math.max(0, this.notificationCount - 1);
    this.updateNotificationBadge(this.notificationCount);
    
    this.emit('notification_read', data);
  }

  showBrowserNotification(data) {
    if (Notification.permission !== 'granted') {
      return;
    }

    const notification = new Notification(data.title, {
      body: data.body,
      icon: data.icon || '/favicon.svg',
      badge: data.badge,
      requireInteraction: data.requireInteraction || false,
      actions: data.actions,
      data: data.data,
      tag: data.tag || `notification_${Date.now()}`
    });

    notification.onclick = () => {
      window.focus();
      this.emit('notification_click', data);
      notification.close();
      
      // Navigate to relevant page if URL provided
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    };

    // Auto close after 5 seconds if not requiring interaction
    if (!data.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }

  updateNotificationUI(notification) {
    // Update notification badge
    this.updateNotificationBadge(this.notificationCount);
    
    // Add to notification dropdown/list
    this.addToNotificationList(notification);
    
    // Show toast notification
    this.showToast(notification);
  }

  addToNotificationList(notification) {
    const notificationList = document.getElementById('notification-list');
    if (notificationList) {
      const notificationElement = this.createNotificationElement(notification);
      notificationList.insertBefore(notificationElement, notificationList.firstChild);
      
      // Limit to 50 notifications in DOM
      const notifications = notificationList.querySelectorAll('.notification-item');
      if (notifications.length > 50) {
        notifications[notifications.length - 1].remove();
      }
    }
  }

  createNotificationElement(notification) {
    const element = document.createElement('div');
    element.className = `notification-item notification-${notification.type} ${notification.read ? 'read' : 'unread'}`;
    element.setAttribute('data-notification-id', notification.id);
    
    element.innerHTML = `
      <div class="notification-icon">
        ${this.getIconForType(notification.type)}
      </div>
      <div class="notification-content">
        <div class="notification-title">${this.escapeHtml(notification.title)}</div>
        <div class="notification-message">${this.escapeHtml(notification.message)}</div>
        <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
      </div>
      <div class="notification-actions">
        ${!notification.read ? `
          <button class="mark-read-btn" onclick="window.notificationClient?.markAsRead('${notification.id}')">
            Mark as Read
          </button>
        ` : ''}
        <button class="close-btn" onclick="this.closest('.notification-item').remove()">
          ×
        </button>
      </div>
    `;

    // Add click handler for the entire notification
    element.addEventListener('click', (e) => {
      if (!e.target.classList.contains('mark-read-btn') && !e.target.classList.contains('close-btn')) {
        if (notification.data?.url) {
          window.location.href = notification.data.url;
        }
        if (!notification.read) {
          this.markAsRead(notification.id);
        }
      }
    });

    return element;
  }

  rebuildNotificationList() {
    // This would typically fetch recent notifications from server
    // For now, just ensure the list is properly initialized
    const notificationList = document.getElementById('notification-list');
    if (notificationList && this.isConnected) {
      // Request recent notifications from server
      this.socket.send(JSON.stringify({
        type: 'get_recent_notifications',
        limit: 20
      }));
    }
  }

  showToast(notification) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${notification.type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">
          ${this.getIconForType(notification.type)}
        </div>
        <div class="toast-text">
          <div class="toast-title">${this.escapeHtml(notification.title)}</div>
          <div class="toast-message">${this.escapeHtml(notification.message)}</div>
        </div>
        <button class="toast-close" onclick="this.closest('.toast').remove()">×</button>
      </div>
    `;

    // Add to container with animation
    toastContainer.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }
    }, 5000);

    // Limit number of toasts
    const toasts = toastContainer.querySelectorAll('.toast');
    if (toasts.length > 5) {
      toasts[0].remove();
    }
  }

  updateNotificationBadge(count = null) {
    if (count !== null) {
      this.notificationCount = count;
    }
    
    const badges = document.querySelectorAll('.notification-badge, #notification-badge');
    badges.forEach(badge => {
      if (this.notificationCount > 0) {
        badge.textContent = this.notificationCount > 99 ? '99+' : this.notificationCount;
        badge.style.display = 'inline-block';
        badge.classList.add('has-notifications');
      } else {
        badge.style.display = 'none';
        badge.classList.remove('has-notifications');
      }
    });
  }

  playNotificationSound() {
    // Optional: play a subtle notification sound
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(err => {
        // Ignore errors (user might not have interacted with page yet)
        console.log('Could not play notification sound:', err.message);
      });
    } catch (error) {
      // Sound file doesn't exist or other error
      console.log('Notification sound not available');
    }
  }

  // Utility methods
  getIconForType(type) {
    const icons = {
      'info': '🔔',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'message': '💬',
      'system': '🔧',
      'update': '📈',
      'reminder': '⏰',
      'achievement': '🏆',
      'default': '🔔'
    };
    return icons[type] || icons.default;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    // Less than 1 minute
    if (diff < 60000) {
      return 'just now';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    
    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }
    
    // Older than 7 days, show date
    return time.toLocaleDateString();
  }

  // Public API methods
  markAsRead(notificationId) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'mark_as_read',
        notificationId: notificationId
      }));
    }
  }

  markAllAsRead() {
    if (this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'mark_all_as_read'
      }));
    }
  }

  sendMessage(type, data) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify({
        type: type,
        data: data
      }));
    } else {
      console.warn('Not connected to notification service');
    }
  }

  // Event system
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in notification event callback:', error);
        }
      });
    }
  }

  // Lifecycle methods
  destroy() {
    if (this.socket) {
      this.socket.close(1000); // Normal closure
    }
    this.listeners.clear();
    this.isInitialized = false;
    
    // Clean up global reference
    if (window.notificationClient === this) {
      delete window.notificationClient;
    }
  }

  // Reconnect manually
  forceReconnect() {
    if (this.socket) {
      this.socket.close();
    }
    this.reconnectAttempts = 0;
    this.connect();
  }

  // Get connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      notificationCount: this.notificationCount,
      hasPermission: Notification.permission === 'granted'
    };
  }
}

// Global instance variable
let notificationClientInstance = null;

// Initialize notification client
export function initializeNotificationClient(options = {}) {
  // Prevent multiple instances
  if (notificationClientInstance) {
    console.log('Notification client already initialized');
    return notificationClientInstance;
  }

  try {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        notificationClientInstance = new AstroWebNotificationClient(options);
        window.notificationClient = notificationClientInstance;
      });
    } else {
      notificationClientInstance = new AstroWebNotificationClient(options);
      window.notificationClient = notificationClientInstance;
    }

    console.log('✅ Notification client initialized');
    return notificationClientInstance;

  } catch (error) {
    console.error('Failed to initialize notification client:', error);
    return null;
  }
}

// Get existing instance
export function getNotificationClient() {
  return notificationClientInstance || window.notificationClient;
}

// Cleanup function for page unload
export function cleanupNotificationClient() {
  if (notificationClientInstance) {
    notificationClientInstance.destroy();
    notificationClientInstance = null;
  }
}

// Auto cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupNotificationClient);
}

// Export the class for advanced usage
export { AstroWebNotificationClient };
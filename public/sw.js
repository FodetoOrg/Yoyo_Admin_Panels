// Service Worker for Web Push Notifications
const CACHE_NAME = 'hotel-booking-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Push event - handle incoming web push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  if (!event.data) {
    console.log('Push event but no data');
    return;
  }

  try {
    const data = event.data.json();
    console.log('Push data:', data);

    const options = {
      body: data.body,
      icon: data.icon || '/favicon.svg',
      badge: data.badge || '/favicon.svg',
      image: data.image,
      data: data.data,
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || [],
      tag: data.tag || 'default',
      timestamp: data.data?.timestamp || Date.now(),
      vibrate: [200, 100, 200],
      silent: false
    };

    // Play notification sound
    playNotificationSound();

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );

  } catch (error) {
    console.error('Error processing push notification:', error);
    
    // Play notification sound even for fallback
    playNotificationSound();
    
    // Fallback notification
    event.waitUntil(
      self.registration.showNotification('New Notification', {
        body: 'You have a new notification',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [200, 100, 200],
        silent: false
      })
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const data = event.notification.data || {};
  const action = event.action;
  
  if (action === 'dismiss') {
    console.log('Notification dismissed');
    return;
  }
  
  // Default action or 'view' action
  const urlToOpen = data.url || '/admin/dashboard';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if there's already a window open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window is open, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  
  // Optional: Track notification dismissal
  const data = event.notification.data || {};
  if (data.trackClose) {
    // Send analytics event
    fetch('/api/analytics/notification-dismissed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        notificationId: data.notificationId,
        userId: data.userId,
        timestamp: Date.now()
      })
    }).catch(console.error);
  }
});

// Background sync for offline notification handling
self.addEventListener('sync', (event) => {
  if (event.tag === 'notification-sync') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  try {
    // Handle any pending notifications when back online
    console.log('Syncing notifications...');
  } catch (error) {
    console.error('Failed to sync notifications:', error);
  }
}
// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Function to play notification sound
function playNotificationSound() {
  try {
    // Try to play a big beep sound using Web Audio API
    const audioContext = new (self.AudioContext || self.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Create a big notification sound (very loud and longer)
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(1400, audioContext.currentTime + 0.4);
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.6);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.8);
    
    // Very high volume (0.8) and longer duration (1.0 seconds)
    gainNode.gain.setValueAtTime(0.8, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.0);
    
    // Also try to notify any open clients to play sound
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'PLAY_NOTIFICATION_SOUND',
          data: { timestamp: Date.now() }
        });
      });
    });
    
  } catch (error) {
    console.log('Could not play notification sound in service worker:', error);
    
    // Fallback: try to notify clients to play sound
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'PLAY_NOTIFICATION_SOUND',
          data: { timestamp: Date.now() }
        });
      });
    });
  }
}
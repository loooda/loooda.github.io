// Firebase Messaging Service Worker for Background/Closed-Device Notifications
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Config provided by the user to connect to their custom Firebase backend
const firebaseConfig = {
  apiKey: "AIzaSyAfpk5jZk6HPTMfK-FMfGFspw3lJ1yUTr8",
  authDomain: "new-prototype-pld6j.firebaseapp.com",
  databaseURL: "https://new-prototype-pld6j-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "new-prototype-pld6j",
  storageBucket: "new-prototype-pld6j.firebasestorage.app",
  messagingSenderId: "620752998568",
  appId: "1:620752998568:web:a3663045ec0cf3bdf3b29d"
};

// Initialize Firebase App inside the Service Worker
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Intercept background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message payload: ', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'نبض العالم | Pulse of the World';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.message || 'لديك تنبيه إخباري جديد وعاجل!',
    icon: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=192&h=192&q=80',
    badge: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=192&h=192&q=80',
    vibrate: [200, 100, 200],
    data: {
      url: payload.data?.url || '/'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click to focus or open the web app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const targetUrl = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

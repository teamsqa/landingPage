// Firebase Cloud Messaging Service Worker
// Este archivo debe estar en la raíz de /public

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Configuración de Firebase (usar las mismas variables que en tu app)
const firebaseConfig = {
  apiKey: "AIzaSyB7N-sAq34wOlUzqCJv8XYwops7EkjuUtI",
  authDomain: "teamqa-54b3c.firebaseapp.com", 
  projectId: "teamqa-54b3c",
  storageBucket: "teamqa-54b3c.firebasestorage.app",
  messagingSenderId: "636428736114",
  appId: "1:636428736114:web:6acf15d81a26ffad6f54eb"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener instancia de messaging
const messaging = firebase.messaging();

// Manejar mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'TeamsQA';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes una nueva notificación',
    icon: '/Logo.svg',
    badge: '/Logo.svg',
    image: payload.notification?.image || '/Logo.svg',
    data: {
      click_action: payload.data?.click_action || '/',
      url: payload.data?.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/Logo.svg'
      },
      {
        action: 'close', 
        title: 'Cerrar'
      }
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200],
    tag: 'teamsqa-notification'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clicks en las notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  const clickAction = event.notification.data?.click_action || '/';
  
  if (event.action === 'open' || !event.action) {
    // Abrir la URL especificada
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.postMessage({
              type: 'NOTIFICATION_CLICKED',
              data: event.notification.data
            });
            return;
          }
        }
        
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow(clickAction);
        }
      })
    );
  }
  // Si es 'close', no hacer nada (la notificación ya se cerró)
});

// Manejar instalación del service worker
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installing.');
  event.waitUntil(self.skipWaiting());
});

// Manejar activación del service worker
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activating.');
  event.waitUntil(self.clients.claim());
});

// Manejar actualizaciones del service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

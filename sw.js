// ==========================================================================
// Service Worker für Mobile Performance & Offline-Support
// ==========================================================================

const CACHE_NAME = 'bastelglueck-v1';
const STATIC_CACHE = 'bastelglueck-static-v1';
const DYNAMIC_CACHE = 'bastelglueck-dynamic-v1';

// Dateien die gecacht werden sollen
const STATIC_FILES = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/manifest.json',
  '/files/DSC_5600.jpeg'
];

// Service Worker Installation
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Service Worker Aktivierung
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Alte Caches löschen
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch Event - Cache-First Strategie für bessere mobile Performance
self.addEventListener('fetch', event => {
  // Nur GET-Requests cachen
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache Hit - return cached version
        if (response) {
          console.log('Service Worker: Cache hit for', event.request.url);
          return response;
        }

        // Cache Miss - fetch from network and cache
        console.log('Service Worker: Cache miss for', event.request.url);
        
        return fetch(event.request)
          .then(fetchResponse => {
            // Check if valid response
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Clone response for caching
            const responseToCache = fetchResponse.clone();
            
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                // Cache für zukünftige Requests
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          })
          .catch(error => {
            console.error('Service Worker: Fetch failed', error);
            
            // Fallback für HTML-Seiten (Offline-Fallback)
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            // Fallback für Bilder
            if (event.request.headers.get('accept').includes('image')) {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" fill="#999">Bild nicht verfügbar</text></svg>',
                { 
                  headers: { 
                    'Content-Type': 'image/svg+xml' 
                  } 
                }
              );
            }

            throw error;
          });
      })
  );
});

// Background Sync für bessere mobile Konnektivität
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Hier könnten Sie z.B. Formulardaten synchronisieren
      console.log('Service Worker: Background sync completed')
    );
  }
});

// Push Notifications (für zukünftige Features)
self.addEventListener('push', event => {
  console.log('Service Worker: Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'Neue Inhalte verfügbar!',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Entdecken',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Schließen',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Bastelglück by Reni', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Notification bereits geschlossen
  } else {
    // Default action
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message Handler für Kommunikation mit main thread
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    // Force cache update
    event.waitUntil(
      caches.delete(STATIC_CACHE)
        .then(() => caches.open(STATIC_CACHE))
        .then(cache => cache.addAll(STATIC_FILES))
    );
  }
});

// Error Handler
self.addEventListener('error', event => {
  console.error('Service Worker: Error occurred', event.error);
});

// Unhandled Promise Rejection Handler
self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker: Unhandled promise rejection', event.reason);
});

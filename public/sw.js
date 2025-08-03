const CACHE_NAME = 'alumni-org-v1.0.5';
const urlsToCache = [
  '/logo.jpg',
  '/msn2.png',
];

// Check if we're in development mode
const isDevelopment = self.location.hostname === 'localhost' || 
                     self.location.hostname === '127.0.0.1' ||
                     self.location.hostname.includes('dev') ||
                     self.location.hostname.includes('staging') ||
                     self.location.port === '8080';

// Install event - cache logo, hero, and notification images
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Fetch event - cache logo, hero, and notification images
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip cache for development
  if (isDevelopment) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache logo, hero, and notification images
  if (request.url === self.location.origin + '/logo.jpg' ||
      request.url === self.location.origin + '/msn2.png') {
    
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version but also update cache in background
            fetch(request)
              .then((response) => {
                if (response && response.status === 200) {
                  const responseToCache = response.clone();
                  caches.open(CACHE_NAME)
                    .then((cache) => {
                      cache.put(request, responseToCache);
                    });
                }
              })
              .catch(() => {
                // Ignore fetch errors for background updates
              });
            return cachedResponse;
          }

          // Not in cache, fetch from network
          return fetch(request)
            .then((response) => {
              // Cache successful responses
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseToCache);
                  });
              }
              return response;
            });
        })
    );
  } else {
    // For everything else, don't cache at all - just fetch from network
    event.respondWith(fetch(request));
  }
});

// Activate event - clean up old caches and take control immediately
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ])
  );
}); 
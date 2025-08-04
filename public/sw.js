// Minimal service worker that doesn't interfere with requests
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - take control immediately
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    // Take control of all clients immediately
    self.clients.claim()
  );
});

// No fetch event listener - let all requests pass through normally 
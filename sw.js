const CACHE_NAME = 'memento-mori-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './styles.css',
  './src/components/quote-list.js',
  './src/components/quote-form.js',
  './src/components/memento-calendar.js',
  './src/components/death-calculator.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Handle API calls
  if (event.request.url.includes('/.netlify/functions/airtable')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Return empty data if offline
          return new Response(JSON.stringify({
            records: []
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a success response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
}); 
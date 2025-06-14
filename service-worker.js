// Use importScripts to load Workbox in a non-module Service Worker
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js');

// Precache your app shell (pass an array or use tooling to inject __WB_MANIFEST)
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Cache Airtable API calls
workbox.routing.registerRoute(
  ({ url }) => url.origin === 'https://api.airtable.com',
  new workbox.strategies.NetworkFirst({ cacheName: 'airtable-cache' })
);

// Optional: handle push notifications
self.addEventListener('push', event => {
  const data = event.data?.json() || { title: 'New Quote', body: 'A fresh quote is in.' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icons/icon-192.png'
    })
  );
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('.'));
});